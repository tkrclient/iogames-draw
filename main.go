package main

import (
    "flag"
	"log"
	"net/http"
)

func main() {
    // Define the address and directory to serve
    addr := flag.String("addr", ":3000", "http service address")
    dir := flag.String("dir", ".", "the directory to serve files from")
    hub := newHub()
    go hub.run()
    flag.Parse()

    // Create a file server to serve files from the specified directory
    fileServer := http.FileServer(http.Dir(*dir))

    // Handle "/" to serve all files in the directory
    http.Handle("/", fileServer)

    // Handle "/ws" for WebSocket connections
	http.HandleFunc("/ws", hub.handleWebSocket)

    // Start the HTTP server
    log.Printf("Serving files from %s on HTTP port: %s\n", *dir, *addr)
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
