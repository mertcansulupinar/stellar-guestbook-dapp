#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[derive(Clone)]
#[contracttype]
pub struct MessageData {
    pub sender: Address,
    pub message: String,
    pub timestamp: u64,
}

#[contract]
pub struct GuestbookContract;

#[contractimpl]
impl GuestbookContract {
    pub fn add_message(env: Env, sender: Address, message: String) -> bool {
        sender.require_auth();

        let message_data = MessageData {
            sender: sender.clone(),
            message: message.clone(),
            timestamp: env.ledger().timestamp(),
        };

        let key = String::from_str(&env, "messages");
        let mut messages: Vec<MessageData> = match env.storage().persistent().get(&key) {
            Some(stored) => stored,
            None => Vec::new(&env),
        };

        messages.push_back(message_data);
        env.storage().persistent().set(&key, &messages);

        true
    }

    pub fn get_messages(env: Env) -> Vec<MessageData> {
        let key = String::from_str(&env, "messages");
        match env.storage().persistent().get(&key) {
            Some(stored) => stored,
            None => Vec::new(&env),
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};
    use soroban_sdk::{Address, Env};

    #[test]
    fn test_add_and_get() {
        let env = Env::default();
        let contract_id = env.register_contract(None, GuestbookContract);
        let client = GuestbookContractClient::new(&env, &contract_id);

        let sender = Address::generate(&env);
        env.mock_all_auths();

        let message = String::from_str(&env, "Hello Stellar!");
        assert!(client.add_message(&sender, &message));

        let messages = client.get_messages();
        assert_eq!(messages.len(), 1);
        assert_eq!(messages.get(0).unwrap().message, message);
    }
}
