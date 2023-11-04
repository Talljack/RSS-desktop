use log::warn;
use crate::window::config_window;
use crate::config::{get, set};

pub fn check_update(app_handle: tauri::AppHandle) {
    let enable = match get("check_update") {
        Some(value) => value.as_bool().unwrap(),
        None => {
            set("check_update", false);
            false
        },
    };
    if enable {
        tauri::async_runtime::spawn(async move {
            match tauri::updater::builder(app_handle).check().await {
                Ok(update) => {
                    if update.is_update_available() {
                        warn!("========== check_update update: {} =================", update.latest_version());
                        config_window("updater");
                    }
                },
                Err(e) => {
                    warn!("========== check_update error: {} =================", e.to_string());
                }
            }
        });
    }
}