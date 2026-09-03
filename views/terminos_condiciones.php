<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Términos y Condiciones | Blue EcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/terminos-condiciones.css">
</head>
<body>
    <?php include(__DIR__ . '/fragments/navbar.php'); ?>
    <main class="terms-page"><article class="terms-card">
        <header class="terms-header"><p class="terms-eyebrow">BLUE ECOSIM</p><h1>Términos y Condiciones de Uso</h1><p>Fecha de entrada en vigor y última actualización: 26 de agosto de 2026</p></header>
        <section><h2>1. Identificación y aceptación</h2><p>Estos Términos y Condiciones regulan el acceso, registro y utilización de Blue EcoSim, incluidos sus simuladores, contenidos educativos, recursos y servicios asociados. Al crear una cuenta, marcar la casilla de aceptación, acceder o utilizar la Plataforma, confirmas que has leído, comprendido y aceptado este documento. Si no estás de acuerdo con alguno de sus apartados, no deberás utilizar la Plataforma.</p></section>
        <section><h2>2. Finalidad de la Plataforma</h2><p>Blue EcoSim es una plataforma digital educativa e informativa para explorar ecosistemas acuáticos mediante simulaciones, visualizaciones y recursos didácticos. Sus contenidos y resultados no constituyen asesoría científica, ambiental, técnica, jurídica ni financiera; tampoco sustituyen estudios de campo, análisis de impacto ambiental, permisos ni la consulta a profesionales competentes.</p></section>
        <section><h2>3. Registro, cuenta y seguridad</h2><p>Para acceder a ciertas funciones deberás proporcionar información completa, exacta y actualizada. Tu cuenta es personal e intransferible. Eres responsable de proteger tus credenciales y de comunicar de inmediato cualquier uso no autorizado. Blue EcoSim podrá requerir la verificación del correo electrónico y aplicar medidas razonables de seguridad ante actividad inusual o riesgos para el servicio.</p></section>
        <section><h2>4. Uso permitido y conductas prohibidas</h2><p>Se te concede una licencia limitada, personal, revocable y no transferible para usar la Plataforma con fines educativos, personales, académicos o de investigación no comercial. No podrás usarla para fines ilícitos, acceder sin autorización a cuentas o sistemas, interferir con su seguridad o disponibilidad, introducir código malicioso, extraer datos de forma automatizada sin permiso, suplantar identidades ni publicar contenido que vulnere la ley o derechos de terceros.</p></section>
        <section><h2>5. Contenido de usuario</h2><p>Si guardas observaciones, comentarios u otros materiales, eres responsable de que sean legales, exactos y de que cuentes con los derechos necesarios. Conservas tus derechos sobre ese contenido, pero autorizas a Blue EcoSim a almacenarlo y mostrarlo únicamente para operar, proteger y mejorar las funciones de la Plataforma. Podremos retirar contenido que incumpla estos Términos o la legislación aplicable.</p></section>
        <section><h2>6. Propiedad intelectual</h2><p>El nombre, diseño, código, simulaciones, textos, recursos visuales y demás componentes de Blue EcoSim están protegidos por la normativa de propiedad intelectual. No se te transfiere ningún derecho de propiedad. No podrás copiar, modificar, distribuir, vender o explotar comercialmente estos elementos sin autorización previa y escrita.</p></section>
        <section><h2>7. Simulaciones y contenido científico</h2><p>Las simulaciones se basan en modelos y supuestos simplificados. Sus resultados pueden variar según los datos introducidos, las limitaciones del modelo y la versión de la Plataforma, por lo que no garantizan una representación completa de un ecosistema real. Las decisiones adoptadas con base en ellos serán responsabilidad exclusiva de quien las tome.</p></section>
        <section><h2>8. Privacidad</h2><p>Blue EcoSim podrá tratar los datos necesarios para crear y administrar cuentas, verificar correos, conservar avances y proteger el servicio. El tratamiento se rige por la Política de Privacidad de Blue EcoSim y por la normativa aplicable. No incorpores datos personales sensibles en campos que no hayan sido habilitados expresamente para ese fin.</p></section>
        <section><h2>9. Disponibilidad, cambios y suspensión</h2><p>La Plataforma se ofrece según disponibilidad. Podemos realizar mantenimiento, actualizaciones, correcciones, suspensiones o cambios en funciones y contenidos por motivos técnicos, de seguridad, operativos, pedagógicos o legales. También podremos restringir, suspender o cancelar cuentas ante incumplimientos, riesgos de seguridad, afectación a terceros o requerimientos legales.</p></section>
        <section><h2>10. Limitación de responsabilidad</h2><p>En la máxima medida permitida por la ley, Blue EcoSim no será responsable por daños, pérdidas de datos, interrupciones, decisiones o consecuencias derivadas del uso o de la imposibilidad de uso de la Plataforma. Esta limitación no excluye responsabilidades que la legislación aplicable no permita limitar.</p></section>
        <section><h2>11. Actualizaciones, legislación y contacto</h2><p>Podremos actualizar estos Términos para reflejar cambios en la Plataforma, sus prácticas o la normativa aplicable. La versión vigente mostrará su fecha de actualización. Se interpretarán conforme a la legislación aplicable donde opere Blue EcoSim, sin perjuicio de derechos irrenunciables de la persona usuaria. Para consultas o reportes, utiliza el canal oficial de contacto del proyecto.</p></section>
        <div class="terms-notice"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><p>Al aceptar la casilla durante el registro y utilizar Blue EcoSim, confirmas tu aceptación de estos Términos y Condiciones.</p></div>
    </article></main>
    <?php include(__DIR__ . '/fragments/footer.php'); ?>
</body>
</html>
