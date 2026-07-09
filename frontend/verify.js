const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:8080/estudiante.html');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
        localStorage.setItem('juntos_user_role', 'estudiante');
        localStorage.setItem('juntos_user_name', 'Ana Torres');
        localStorage.setItem('juntos_user_email', 'ana@ejemplo.com');
        localStorage.setItem('juntos_theory_state', JSON.stringify({
            detectedDifficulties: [{ difficulty: "no identifica todos los valores posibles" }],
            recommendations: []
        }));
    });

    await page.goto('http://localhost:8080/estudiante.html');
    await page.waitForLoadState('networkidle');

    console.log("Looking for guia button...");
    const guiaBtn = await page.locator('li[data-target="guia"]');
    await guiaBtn.waitFor({ state: 'visible', timeout: 5000 });
    await guiaBtn.click();
    console.log("Clicked guia button");
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'guia_ejercicios.png' });

    console.log("Looking for btn-resolve-required...");
    const resolverBtn = await page.locator('.btn-resolve-required').first();
    await resolverBtn.waitFor({ state: 'visible', timeout: 5000 });
    await resolverBtn.click();
    console.log("Clicked btn-resolve-required");
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'resolver_ejercicio.png' });

    await page.locator('#resolucion-text').fill('Mi respuesta');
    await page.locator('#btn-enviar').click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'feedback_ejercicio.png' });

    await page.locator('#btn-volver-guia').click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'guia_ejercicios_back.png' });
  } catch (error) {
    console.error("Error occurred:", error);
    await page.screenshot({ path: 'error_state.png' });
  } finally {
    await browser.close();
  }
})();
