use crate::config::get;

#[tauri::command]
pub fn set_proxy() -> Result<bool, ()>{
    let host = match get("proxy_host") {
        Some(value) => value.as_str().unwrap().to_string(),
        None => return Err(()),
    };
    let port = match get("proxy_port") {
        Some(value) => value.as_i64().unwrap(),
        None => {
            return Err(())
        }
    };
    let proxy = format!("http://{}:{}", host, port);
    std::env::set_var("all_proxy", &proxy);
    std::env::set_var("http_proxy", &proxy);
    std::env::set_var("https_proxy", &proxy);
    std::env::set_var("no_proxy", "127.0.0.1,localhost,aliyuncs.com");
    Ok(true)
}