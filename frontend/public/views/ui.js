export function setBanner(element, value) {
  if (!value) {
    element.style.display = "none";
    element.textContent = "";
    element.removeAttribute("data-kind");
    return;
  }

  element.style.display = "block";
  element.textContent = value.message;
  element.dataset.kind = value.kind;
}

export function el(tag, attributes = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, val] of Object.entries(attributes)) {
    if (val === null || val === undefined) {
      continue;
    }

    if (key === "class") {
      node.className = val;
      continue;
    }

    if (key === "text") {
      node.textContent = val;
      continue;
    }

    node.setAttribute(key, String(val));
  }

  for (const child of children) {
    if (child === null || child === undefined) {
      continue;
    }
    node.appendChild(child);
  }

  return node;
}
