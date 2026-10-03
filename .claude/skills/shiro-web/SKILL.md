---
name: shiro-web
description: Hacer cualquier cambio en la web de SHIRO Wellness Club (shirowellness.com) y publicarlo. Usala siempre que Santiago pida modificar, corregir, agregar o sacar algo del sitio (textos, precios, fotos, secciones, formulario, colores, SEO, imagen para redes, privacidad), o pida publicar o volver atrás la web, aunque no diga "web" (por ejemplo "cambiá el precio Founder en la página").
---

# Cambios en la web de SHIRO

El código **no está en este repo** (`mi-primer-pr`). Está en `zucarita3-rgb/shiro-validacion`, rama
**`web-shirowellness`**. El sitio vive en el **Worker `shirowellness`** de Cloudflare, **no en Pages**.
El proyecto de Pages `shirowellness` es un resto viejo: no publicar ahí.

## 1. Preparar
1. `add_repo` con owner `zucarita3-rgb`, repo `shiro-validacion`, `access: "push"`.
2. `git clone --depth 1 -b web-shirowellness https://github.com/zucarita3-rgb/shiro-validacion /home/user/shiro-validacion`
3. Leer `DEPLOY.md` y `_headers` de la rama antes de tocar nada.
4. Verificar que existan `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` (sin imprimir el valor).
   Si faltan, leer la documentación del entorno (`read_documentation`, tema `environment.secrets`) y
   pedir que se carguen en la configuración del entorno. **Nunca** pedir que peguen el token en el chat.

## 2. Hacer el cambio
- El sitio es estático: `index.html`, `app.js`, `privacidad.html` e imágenes en la raíz. Sin build.
- Respetar la paleta SHIRO definida en `:root` de `index.html` (Tierra, Papel, Termomadera, Arena, Cold).
- **CSP**: si el cambio carga algo de otro dominio (mapa, Instagram, Pixel, Analytics, YouTube, widget,
  fuente), agregar ese dominio en la directiva correcta de `_headers`. Si no, se bloquea sin avisar.
  No sacar `cloudflareinsights.com` (Analytics) ni `script.google.com` (formulario).
- Si se cambia la imagen para redes, usar un nombre nuevo (`og-v3.jpg`) y actualizar todas las
  referencias: WhatsApp y Facebook guardan la imagen vieja según el nombre.

## 3. Probar antes de publicar
1. Levantar local: `cd /home/user/shiro-validacion && npx -y wrangler@4 dev --port 8787` (en segundo plano).
2. `node /home/user/mi-primer-pr/.claude/skills/shiro-web/check.mjs http://localhost:8787/ <scratchpad>`
   tiene que dar "sin errores" en 1440 y 390. Mirar las capturas.
3. Mostrarle a Santiago las capturas y el resumen del cambio, y **esperar su OK**:
   publicar cambia el sitio en vivo.

## 4. Publicar y verificar
1. `cd /home/user/shiro-validacion && npx -y wrangler@4 deploy --message "<qué cambió>"`.
   Anotar el Version ID anterior (`npx wrangler deployments list`) para poder volver.
2. `node .../check.mjs https://shirowellness.com/ <scratchpad>`: sin errores.
3. Commit en `web-shirowellness` con mensaje claro y `git push origin web-shirowellness`.
   El repo tiene que quedar siempre igual a lo publicado.
4. Registrar el cambio en el Drive de SHIRO con la skill `shiro-drive-sync` si está disponible.

## Volver atrás
`npx wrangler deployments list` y luego `npx wrangler rollback <version-id>`. Después revertir el commit
en la rama para que el repo siga igual a lo publicado.

## No hacer
- No publicar en Cloudflare Pages ni mover los dominios del Worker.
- No usar la rama `main` de `shiro-validacion` como fuente sin preguntar: tiene trabajo distinto.
- No inscribir el dominio en hstspreload.org.
