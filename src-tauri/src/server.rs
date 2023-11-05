use crate::config::{get, set};
use std::thread;
use tiny_http::{Request, Response, Server};
use tauri::api::notification;
use log::{warn, info};
use reqwest;
use tokio::runtime::Runtime;
use xml2json_rs::JsonBuilder;
pub fn start_server() {
    let port = match get("server_port") {
        Some(value) => value.as_i64().unwrap(),
        None => {
            set("server_port", 8081);
            8081
        }
    };
    thread::spawn(move || {
        let server = match Server::http(format!("127.0.0.1:{port}")) {
            Ok(server) => server,
            Err(e) => {
                let _ = notification::Notification::new("RSS Reader")
                    .title("Server start error")
                    .body("Please check the port is occupied")
                    .show();
                warn!("Server start error: {:?}", e);
                return;
            }
        };
        for request in server.incoming_requests() {
            println!("received request! method: {:?}, url: {:?}",
                     request.method(),
                     request.url());
            http_handle(request)
        }
    });
}

fn http_handle(request: Request) {
    let url = request.url().to_string();
    info!("========== http_handle url: {} =================", url);
    match request.url() {
        "/rss_content" => handle_rss_content(request),
        _ => {
            let response = Response::from_string("404");
            request.respond(response).unwrap();
        }
    }
}

fn handle_rss_content(request: Request) {
    let url = request.url().to_string();
    let fetch_data = async {
        reqwest::get(url).await.unwrap().text().await.unwrap()
    };
    let data = Runtime::new().unwrap().block_on(fetch_data);
    let json_builder = JsonBuilder::default();
    let data = match json_builder.build_string_from_xml(&data) {
        Ok(data) => data,
        Err(e) => {
            warn!("========== json_builder error: {} =================", e.details());
            return;
        }
    };
    let response = Response::from_string(data);
    request.respond(response).unwrap();
}