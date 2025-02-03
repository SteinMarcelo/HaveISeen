import os
import subprocess

# Caminhos das pastas
have_i_seen_path = r"C:\Users\Marcelo\Documents\TDS\PI\HaveISeen"
api_project_path = r"C:\Users\Marcelo\Documents\TDS\PI\api\project\src"

# Comandos para executar
have_i_seen_command = "npx expo -c"
api_project_command = "node server.js"


def run_command_in_terminal(path, command):
    subprocess.Popen(f'start cmd /c "cd {path} && {command}"', shell=True)

# Função para abrir a pasta no VS Code
def open_in_vscode(path):
    subprocess.Popen(f'code "{path}"', shell=True)

# Executar os comandos nos respectivos diretórios
run_command_in_terminal(have_i_seen_path, have_i_seen_command)
run_command_in_terminal(api_project_path, api_project_command)

# Abrir as pastas no VS Code
open_in_vscode(have_i_seen_path)
open_in_vscode(api_project_path)