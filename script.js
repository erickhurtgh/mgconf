document.getElementById('generate-txt').addEventListener('click', () => {
    const instructions = `
Instrucciones de Instalación

== Cambios de HDD a SSD ==

1.  **Dar limpieza al CPU:**
    *   Apagar y desconectar el equipo.
    *   Abrir el gabinete del CPU.
    *   Utilizar aire comprimido para remover el polvo de los componentes internos.

2.  **Clonar el HDD en el SSD (si no hay errores en el arranque de Windows):**
    *   Conectar el nuevo SSD a la computadora.
    *   Utilizar un software de clonación de discos (ej. Macrium Reflect, Clonezilla) para clonar el contenido del HDD al SSD.
    *   Apagar el equipo, desconectar el HDD y dejar solo el SSD como disco de arranque.
    *   Verificar que Windows inicie correctamente desde el SSD.

3.  **Crear 3 usuarios en cada máquina:**
    *   **Administrador:**
        *   Usuario: Administrador
        *   Contraseña: S1s73m@s
    *   **Sistemas:**
        *   Usuario: Sistemas
        *   Contraseña: S1s73m@s
    *   **Car-One:**
        *   Usuario: Car-One
        *   Contraseña: carone
        *   **Importante:** Este perfil no debe poder cambiar la contraseña y estará limitado a autorización de administrador. Se requieren pasos adicionales para esta configuración, posiblemente a través de políticas de grupo locales (gpedit.msc).

4.  **Alimentar inventario:**
    *   Abrir el archivo de inventario (ej. una hoja de cálculo).
    *   Verificar y corregir las siguientes columnas para el equipo actual:
        *   Departamento
        *   Nombre de equipo
        *   IP
        *   Tipo de disco (actualizar a SSD)
        *   Observaciones (ej. "HDD clonado a SSD")

== En caso de encontrar errores en el arranque de Windows ==

1.  **Dar limpieza al CPU:** (Mismos pasos que arriba)

2.  **Cargar Windows desde 0:**
    *   Crear un medio de instalación de Windows (USB o DVD).
    *   Arrancar el equipo desde el medio de instalación.
    *   Seguir las instrucciones para instalar una copia nueva de Windows en el SSD.

3.  **Crear 3 usuarios en cada máquina:** (Mismos usuarios y contraseñas que arriba)

4.  **Instalar programas:**
    *   Descargar los programas desde la siguiente liga de Google Drive:
    *   https://drive.google.com/drive/folders/1rlYIWfwT0gKICTPO461-fvJjottZ2VDo?usp=sharing
    *   Instalar cada programa siguiendo las instrucciones correspondientes.
        *   **Falcon:** El código se encuentra en el archivo "Código.txt".
        *   **ZenWorks:** La clave de registro se encuentra en el archivo "Registros.txt".

5.  **Alimentar inventario:**
    *   Actualizar el inventario con la información del equipo y la nueva instalación.
        *   Observaciones (ej. "Instalación limpia de Windows en SSD")

== Comandos de PowerShell para la creación de usuarios ==

# Abrir PowerShell como Administrador y ejecutar los siguientes comandos:

net user /add Administrador S1s73m@s
net user /add Sistemas S1s73m@s
net user /add Car-One carone
net localgroup "Administradores" Administrador /add # Opcional, si se desea que sea administrador
    `;

    const blob = new Blob([instructions], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'instrucciones.txt';
    a.click();
});

document.getElementById('generate-network-script').addEventListener('click', () => {
    const ip_address = document.getElementById('ip_address').value;
    const subnet_mask = document.getElementById('subnet_mask').value;
    const default_gateway = document.getElementById('default_gateway').value;
    const dns_servers = document.getElementById('dns_servers').value.split(',').map(s => s.trim());
    const workgroup = document.getElementById('workgroup').value;
    const hostname = document.getElementById('hostname').value;

    let scriptContent = `
# Script de PowerShell para la configuración de red y host
# --- Importante ---
# Ejecutar este script como Administrador.

# --- Configuración de Red ---
# Obtener el adaptador de red a configurar (generalmente llamado "Ethernet")
# Puedes cambiar "Ethernet" por el nombre de tu adaptador si es diferente.
$adapter = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1

if ($adapter) {
    Write-Host "Configurando el adaptador de red: $($adapter.Name)"

    # Configuración de la dirección IP
    try {
        New-NetIPAddress -InterfaceAlias $adapter.Name -IPAddress "${ip_address}" -PrefixLength (Get-NetIPAddress -InterfaceAlias $adapter.Name).PrefixLength -DefaultGateway "${default_gateway}" -ErrorAction Stop
        Write-Host "IP y Puerta de Enlace configuradas correctamente."
    } catch {
        Write-Error "No se pudo configurar la IP o la Puerta de Enlace. Error: $_"
    }

    # Configuración de los servidores DNS
    try {
        Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses (${dns_servers.map(dns => `"${dns}"`).join(',')})
        Write-Host "Servidores DNS configurados correctamente."
    } catch {
        Write-Error "No se pudo configurar los servidores DNS. Error: $_"
    }

} else {
    Write-Error "No se encontró un adaptador de red activo."
}

# --- Configuración de Host ---
# Cambiar el nombre del host
if ($hostname) {
    try {
        Rename-Computer -NewName "${hostname}" -Force -Restart
        Write-Host "El nombre del host se ha cambiado a '${hostname}'. El equipo se reiniciará."
    } catch {
        Write-Error "No se pudo cambiar el nombre del host. Error: $_"
    }
}

# Unirse a un grupo de trabajo
if ($workgroup) {
    try {
        Add-Computer -WorkGroupName "${workgroup}" -Force
        Write-Host "El equipo se ha unido al grupo de trabajo '${workgroup}'."
    } catch {
        Write-Error "No se pudo unir al grupo de trabajo. Error: $_"
    }
}

Write-Host "Proceso de configuración finalizado."
# Mantener la ventana abierta por 10 segundos para ver los resultados
Start-Sleep -Seconds 10
`;

    const blob = new Blob([scriptContent], { type: 'application/x-powershell' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'configurar_red.ps1';
    a.click();
});

document.getElementById('generate-script').addEventListener('click', () => {
    const scriptContent = `
# Script de PowerShell para la creación de usuarios

# --- Importante ---
# Ejecutar este script como Administrador.
# Para ello, haga clic derecho sobre el archivo .ps1 y seleccione "Ejecutar como Administrador".

# Creación de los usuarios con sus contraseñas
$users = @(
    @{ Name = "Administrador"; Password = "S1s73m@s" },
    @{ Name = "Sistemas";      Password = "S1s73m@s" },
    @{ Name = "Car-One";       Password = "carone"   }
)

foreach ($user in $users) {
    try {
        # Verificar si el usuario ya existe
        if (Get-LocalUser -Name $user.Name -ErrorAction SilentlyContinue) {
            Write-Host "El usuario '$($user.Name)' ya existe. Asignando nueva contraseña."
            # Asignar la contraseña al usuario existente
            $localUser = Get-LocalUser -Name $user.Name
            $localUser | Set-LocalUser -Password (ConvertTo-SecureString $user.Password -AsPlainText -Force)
            Write-Host "Contraseña actualizada para '$($user.Name)'."
        } else {
            # Crear el nuevo usuario
            New-LocalUser -Name $user.Name -Password (ConvertTo-SecureString $user.Password -AsPlainText -Force) -FullName $user.Name -Description "Usuario creado por script"
            Write-Host "Usuario '$($user.Name)' creado exitosamente."
        }

        # Opcional: Agregar usuarios a un grupo específico, por ejemplo "Usuarios"
        # Add-LocalGroupMember -Group "Users" -Member $user.Name
    }
    catch {
        Write-Error "Ocurrió un error al procesar el usuario '$($user.Name)': $_"
    }
}

# Configuración para que 'Car-One' no pueda cambiar su contraseña
try {
    # Este comando es el método preferido en PowerShell para esta tarea
    Set-LocalUser -Name "Car-One" -PasswordNeverExpires $true -UserMayNotChangePassword $true
    Write-Host "El usuario 'Car-One' ha sido configurado para no poder cambiar su contraseña."
}
catch {
    Write-Error "Error al configurar las restricciones para 'Car-One'. Verifique que el script se ejecuta como Administrador. Error: $_"
}

Write-Host "Proceso de creación de usuarios finalizado."
# Mantener la ventana abierta por 10 segundos para ver los resultados
Start-Sleep -Seconds 10
    `;

    const blob = new Blob([scriptContent], { type: 'application/x-powershell' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'crear_usuarios.ps1';
    a.click();
});
