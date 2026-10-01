#!/usr/bin/env python3
"""Actualiza la carta de index.html a partir de carta.json.

Uso: python3 generar_carta.py
Edita precios, nombres o productos en carta.json y vuelve a correr este script.
Solo reemplaza el bloque entre <!-- CARTA:INICIO --> y <!-- CARTA:FIN -->.
"""
import html
import json
from pathlib import Path

RAIZ = Path(__file__).parent
carta = json.loads((RAIZ / "carta.json").read_text(encoding="utf-8"))


def precio(n):
    return "$" + f"{n:,}".replace(",", ".")


def tarjeta(p):
    e = html.escape
    etiqueta = f'<span class="tag">{e(p["etiqueta"])}</span>' if p.get("etiqueta") else ""
    return (
        f'<article class="product" data-category="{e(p["categoria"])}">'
        f'<div class="product-photo"><img src="{e(p["foto"])}" alt="{e(p["nombre"])}" loading="lazy" width="490" height="490"></div>'
        f'<h3>{e(p["nombre"])}</h3>{etiqueta}<p>{e(p["descripcion"])}</p>'
        f'<div class="product-bottom"><span class="price">{precio(p["precio"])}</span>'
        f'<a class="order" href="{e(p["enlace"])}" target="_blank" rel="noopener" '
        f'aria-label="Pedir {e(p["nombre"])} en Uber Eats">Pedir en Uber Eats <span aria-hidden="true">↗</span></a></div>'
        f"</article>"
    )


cuenta = {c["id"]: 0 for c in carta["categorias"]}
for p in carta["productos"]:
    cuenta[p["categoria"]] += 1

filtros = "".join(
    f'<button type="button" aria-pressed="false" data-filter="{c["id"]}">{html.escape(c["nombre"])}'
    f'<span class="n">{cuenta[c["id"]]}</span></button>'
    for c in carta["categorias"]
)
bloque = (
    "<!-- CARTA:INICIO -->\n"
    f'<div class="filters" role="group" aria-label="Categorías de la carta">{filtros}'
    f'<a class="more" href="{html.escape(carta["tienda_uber_eats"])}" target="_blank" rel="noopener">Bebidas y panadería en Uber Eats ↗</a></div>\n'
    '<div class="products">\n'
    + "\n".join(tarjeta(p) for p in carta["productos"])
    + "\n</div>\n<!-- CARTA:FIN -->"
)

indice = RAIZ / "index.html"
texto = indice.read_text(encoding="utf-8")
inicio = texto.index("<!-- CARTA:INICIO -->")
fin = texto.index("<!-- CARTA:FIN -->") + len("<!-- CARTA:FIN -->")
indice.write_text(texto[:inicio] + bloque + texto[fin:], encoding="utf-8")
print(f"Carta actualizada: {len(carta['productos'])} productos.")
