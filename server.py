import os
import sys
import json
import subprocess
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer

PORT = int(os.environ.get("PORT", 8000))
CPP_SOURCE = "algorithms.cpp"
CPP_EXE = "algorithms.exe" if os.name == 'nt' else "./algorithms"

HAS_PY_BACKEND = False
try:
    import algorithms
    HAS_PY_BACKEND = True
except ImportError:
    HAS_PY_BACKEND = False

def compile_cpp():
    if os.path.exists(CPP_SOURCE):
        print(f"[*] Compiling {CPP_SOURCE} with g++...")
        output_name = "algorithms.exe" if os.name == 'nt' else "algorithms"
        cmd = ["g++", "-O2", CPP_SOURCE, "-o", output_name]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            print(f"[+] C++ Backend successfully compiled: {output_name}")
            return True
        else:
            print(f"[!] C++ compilation failed: {res.stderr}")
            return False
    return False

HAS_CPP_BACKEND = False
if not HAS_PY_BACKEND:
    HAS_CPP_BACKEND = compile_cpp()

class AlgoCraftRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # Route to API endpoint
        if parsed_url.path == "/api/run":
            self.handle_api_run(parsed_url.query)
        else:
            # Serve static files normally
            super().do_GET()

    def handle_api_run(self, query_string):
        params = urllib.parse.parse_qs(query_string)
        
        mode = params.get("mode", [""])[0]
        algo = params.get("algo", [""])[0]
        
        try:
            frames = []
            if HAS_PY_BACKEND:
                if mode == "sort":
                    input_val = params.get("input", [""])[0]
                    frames = algorithms.run_algorithm("sort", algo, input_val)
                elif mode == "pathfind":
                    start_val = params.get("start", ["Delhi"])[0]
                    end_val = params.get("end", ["Chennai"])[0]
                    frames = algorithms.run_algorithm("pathfind", algo, f"{start_val},{end_val}")
                elif mode == "nqueens":
                    size_val = params.get("size", ["8"])[0]
                    frames = algorithms.run_algorithm("nqueens", algo, size_val)
                elif mode == "coloring":
                    colors_val = params.get("m", ["4"])[0]
                    frames = algorithms.run_algorithm("coloring", algo, colors_val)
                print(f"[*] Python Backend Executed mode='{mode}' algo='{algo}' -> Generated {len(frames)} frames")
            
            elif HAS_CPP_BACKEND:
                args = [CPP_EXE, mode, algo]
                if mode == "sort":
                    args.append(params.get("input", [""])[0])
                elif mode == "pathfind":
                    args.append(params.get("start", ["Delhi"])[0])
                    args.append(params.get("end", ["Chennai"])[0])
                elif mode == "nqueens":
                    args.append(params.get("size", ["8"])[0])
                elif mode == "coloring":
                    args.append(params.get("m", ["4"])[0])

                proc = subprocess.run(args, capture_output=True, text=True)
                if proc.returncode == 0:
                    for line in proc.stdout.strip().split("\n"):
                        line = line.strip()
                        if line.startswith("{") and line.endswith("}"):
                            try:
                                frames.append(json.loads(line))
                            except json.JSONDecodeError:
                                pass
                    print(f"[*] C++ Backend Executed mode='{mode}' algo='{algo}' -> Generated {len(frames)} frames")
                else:
                    print(f"[!] C++ execution error: {proc.stderr}")

            else:
                self.send_error_response("No Python or C++ backend available")
                return

            self.send_json_response(frames)

        except Exception as e:
            print(f"[!] Error executing backend: {e}")
            self.send_error_response(str(e))

    def send_json_response(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def send_error_response(self, message):
        self.send_response(400)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        error_data = {"error": message}
        self.wfile.write(json.dumps(error_data).encode("utf-8"))

def run():
    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, AlgoCraftRequestHandler)
    print(f"[+] AlgoCraft Server running on port {PORT}")
    if HAS_PY_BACKEND:
        print("[+] Backend: Python Engine (algorithms.py)")
    elif HAS_CPP_BACKEND:
        print("[+] Backend: C++ Executable Engine (algorithms.cpp)")
    else:
        print("[!] Backend: Client-Side JS Fallback Only")
        
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Shutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    run()
