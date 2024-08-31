#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::path::{Path, PathBuf};
use axum::Router;
use log::{debug, trace, info, LevelFilter};
use axum::http::{HeaderValue, Method};
use magic_eye_internal_lib::server::server_http_verb::{
    __cmd__get_server_request, get_server_request, __cmd__patch_server_request,
    patch_server_request, __cmd__get_json, get_json, __cmd__post_server_request,
    post_server_request,
};
use magic_eye_internal_lib::server::server_config::{
    __cmd__get_server_config_options, get_server_config_options,
};
use magic_eye_internal_lib::utils;
use magic_eye_internal_lib::utils::browser::{__cmd__open_web_browser, open_web_browser};
use magic_eye_internal_lib::utils::config::{
    __cmd__get_config_dir, __cmd__get_config_file, __cmd__get_config_file_content,
    __cmd__update_settings_file, __cmd__save_api_ip, get_config_dir, get_config_file,
    get_config_file_content, update_settings_file, save_api_ip, __cmd__get_api_ip,
    get_api_ip,
};
use magic_eye_internal_lib::utils::window_function::{__cmd__close_splashscreen,close_splashscreen,__cmd__close_window, close_window, __cmd__minimize_window, minimize_window, __cmd__maximize_window, maximize_window, __cmd__unmaximize_window, unmaximize_window};
use tauri::path::BaseDirectory;
use tauri::{generate_handler, Manager, WindowEvent};
use tauri_plugin_log::{Target, TargetKind};
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;
use utils::config::create_configuration_file_setting;
use utils::os_setup_and_info::setup_wayland;

const PORT: u16 = 16780;


#[tauri::command]
fn hello(handle: tauri::AppHandle) -> Result<String, tauri::Error> {
    let resource_path = handle.path().resolve("assets/", BaseDirectory::Resource)?;


    let file = std::fs::File::open(&resource_path).unwrap();
    let ressources = std::fs::read_dir(&resource_path).unwrap();
    println!("{:?}", ressources);
    // get all file in the directory
    for entry in ressources {
        let entry = entry.unwrap();
        let path = entry.path();
        let file_name = path.file_name().unwrap();
       // give array of all file name
        println!("{:?}", file_name);
    }
    
    let file_path = resource_path.to_str().unwrap().to_string();
    Ok(file_path)
    
}




#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tauri::async_runtime::set(tokio::runtime::Handle::current());
    let config_task = tokio::spawn(async {
        create_configuration_file_setting();
    });
    
    #[cfg(target_os = "linux")]
    setup_wayland();
   

    config_task.await?;
    let context = tauri::generate_context!();
    let builder = tauri::Builder::default()
    
    
   
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_devtools::init());



    

    builder
        .on_window_event(|_window, event| {
            if let WindowEvent::Resized(_) = event {
                std::thread::sleep(std::time::Duration::from_nanos(1));
            }
        }) 
        .setup(move |app| {
            info!("Webkit version: {:?}", tauri::webview_version());
    
            trace!("config directory location: {:?}", get_config_dir());
            info!(
                "{:?}",
              dirs_next::config_dir()
                    .expect("Failed to get app data dir")
                    .push("magiceEye")
            );
           let asset_dir_path = app.path().app_data_dir().expect("Failed to get app data dir");
            debug!("asset_dir_path: {:?}", asset_dir_path);

            let resource_path = app.path().resolve("assets/", BaseDirectory::Resource)?;
            
        
            let ressources = std::fs::read_dir(&resource_path).unwrap();
            println!("{:?}", ressources);
            // get all file in the directory
            for entry in ressources {
                let entry = entry.unwrap();
                let path = entry.path();
                let file_name = path.file_name().unwrap();
               // give array of all file name
                println!("{:?}", file_name);
            }

                

            debug!("resource_path: {:?}", resource_path);

           

            tokio::spawn(async move {
                debug!("Initializing...");
                let serve_dir = ServeDir::new(resource_path.to_str().expect("Failed to convert resource path to string"));
                
                let axum_app = Router::new().nest_service("/", serve_dir).layer(
                    CorsLayer::new()
                        .allow_origin("*".parse::<HeaderValue>().expect("Failed to parse header value"))
                        .allow_methods([Method::GET]),
                );
         
                let listener = tokio::net::TcpListener::bind(&format!("127.0.0.1:{}", PORT)).await.expect("Failed to bind to port");
                axum::serve(listener, axum_app).await.unwrap();
            });
            Ok(())
        })
        
        .invoke_handler(generate_handler![
            get_config_dir,
            open_web_browser,
            get_config_dir,
            get_config_file,
            get_config_file_content,
            update_settings_file,
            get_server_config_options,
            patch_server_request,
            close_splashscreen,
            get_server_request,
            save_api_ip,
            get_json,
            post_server_request,
            get_api_ip,
            close_window,
            minimize_window,
            maximize_window,
            unmaximize_window
        ])
        .run(context)
        .expect("error while running tauri application");

    Ok(())
}
