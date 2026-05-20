/**
 * ============================================================
 * PRISMA — Google Apps Script
 * Guarda los mails en Google Sheets automáticamente
 * ============================================================
 *
 * INSTRUCCIONES:
 * 1. Abrí Google Sheets → Extensiones → Apps Script
 * 2. Borrá el código que aparece y pegá este
 * 3. Guardá con Ctrl+S
 * 4. Hacé clic en "Implementar" → "Nueva implementación"
 * 5. Tipo: "Aplicación web"
 * 6. Ejecutar como: "Yo"
 * 7. Quién tiene acceso: "Cualquier persona"
 * 8. Hacé clic en "Implementar"
 * 9. Copiá la URL que te da
 * 10. Pegala en js/landing.js donde dice GOOGLE_SCRIPT_URL
 * ============================================================
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Crear headers si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Fecha',
        'Nombre',
        'Email',
        'Fuente',
        'Arquetipo (si disponible)'
      ]);

      // Formatear headers
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Parsear datos recibidos
    let data = {};
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      data = {
        nombre: 'Sin nombre',
        email: 'Sin email',
        fecha: new Date().toISOString()
      };
    }

    // Guardar fila
    sheet.appendRow([
      new Date(data.fecha || Date.now()),
      data.nombre || '',
      data.email || '',
      data.fuente || 'directo',
      data.arquetipo || ''
    ]);

    // Respuesta exitosa con CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', mensaje: 'Guardado correctamente' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', mensaje: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* doGet — Para probar que el script está activo */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'activo', mensaje: 'PRISMA Apps Script funcionando ✓' }))
    .setMimeType(ContentService.MimeType.JSON);
}
