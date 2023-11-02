// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;
use tauri::App;
use tauri_plugin_log::LogTarget;
use tauri_plugin_autostart::MacosLauncher;
use once_cell::sync::OnceCell;
use tauri::api::notification::Notification;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Global AppHandle
pub static APP: OnceCell<tauri::AppHandle> = OnceCell::new();

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _, cwd| {
            Notification::new(&app.config().tauri.bundle.identifier)
                .title("The program is already running")
                .body(cwd)
                .icon("rss-reader")
                .show()
                .unwrap();
        }))
        .plugin(tauri_plugin_log::Builder::default().targets([
            LogTarget::LogDir,
            LogTarget::Stdout,
            LogTarget::Webview,
        ]).build())
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec![])))
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .system_tray(tauri::SystemTray::new())
        .setup(|app| {
            info!("========== Start APP =================");
            // let store = app.plugin_handle::<tauri_plugin_store::Store>().unwrap();
            #[cfg(target_os = "macos")]
            {
                app.set_activation_policy(tauri::ActivationPolicy::Regular);
                let trusted = macos_accessibility_client::accessibility::application_is_trusted_with_prompt();
                info!("========== trusted: {} =================", trusted);
            }
            // Global handler
            APP.get_or_init(|| app.clone());
            info!("Init config store");
            init_config(app);
            if is_first_run() {
                // todo
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
