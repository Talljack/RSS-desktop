use crate::APP;
use serde_json::{json, Value};
use tauri::plugin::store::{Store, StoreBuilder};

pub struct StoreWrapper(pub Mutex<Store<Wry>>);