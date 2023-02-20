#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

#[tauri::command]
async fn read_article(handle: tauri::AppHandle, content: &str) {
    println!("open the reading article window");
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let clear = CustomMenuItem::new("clear".to_string(), "Clear");
    let operation = Submenu::new("operation", Menu::new().add_item(quit).add_item(clear));
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_submenu(operation);

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "quit" => {
                    std::process::exit(0);
                }
                "clear" => {
                    event.window().close().unwrap();
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![read_article])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
