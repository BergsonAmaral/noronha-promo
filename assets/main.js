// Noronha Promo — front-end interactions
// Os formulários abaixo já estão isolados em funções prontas para, no próximo
// passo, chamar o Supabase (ex: supabase.from('interessados').insert(...)).

// Ícones Lucide (mesmos paths usados no site original), renderizados a partir
// de <i data-lucide="nome"></i> — sem depender de CDN externo.
const LUCIDE_ICONS = {
  "map-pin": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle>',
  "log-in": '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line>',
  "ticket": '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path>',
  "arrow-up-right": '<path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>',
  "arrow-right": '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
  "menu": '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>',
  "smartphone": '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path>',
  "heart": '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>',
  "check": '<path d="M20 6 9 17l-5-5"></path>',
  "compass": '<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle>',
  "waves": '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>',
  "bed-double": '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M12 4v6"></path><path d="M2 18h20"></path>',
  "search": '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',
  "chevron-down": '<path d="m6 9 6 6 6-6"></path>',
  "utensils": '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>',
  "car": '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle>',
  "camera": '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle>',
  "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path>',
  "store": '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path>',
};

function renderIcons(root) {
  (root || document).querySelectorAll("[data-lucide]").forEach((el) => {
    const name = el.getAttribute("data-lucide");
    const paths = LUCIDE_ICONS[name];
    if (!paths) return;
    const size = el.getAttribute("data-size") || "20";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.classList.add("lucide-icon", "lucide-" + name);
    if (el.className) svg.setAttribute("class", svg.getAttribute("class") + " " + el.className);
    svg.innerHTML = paths;
    el.replaceWith(svg);
  });
}
renderIcons();

document.getElementById("ano").textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll-reveal (fade/slide-in ao entrar na viewport)
const revealTargets = document.querySelectorAll("[data-reveal]");
if (revealTargets.length) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }
}

// Header muda de aparência ao rolar a página
const topbar = document.querySelector(".topbar");
if (topbar) {
  const updateTopbar = () => topbar.classList.toggle("is-scrolled", window.scrollY > 12);
  updateTopbar();
  window.addEventListener("scroll", updateTopbar, { passive: true });
}

// Botão "voltar ao topo"
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  const updateBackToTop = () => backToTop.classList.toggle("is-visible", window.scrollY > 640);
  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

// Scrollspy: destaca o link do menu correspondente à seção visível
const navLinks = [...document.querySelectorAll(".navbar-inner a")];
const sectionsById = navLinks
  .map((link) => {
    const id = link.getAttribute("href").replace("#", "");
    const section = id ? document.getElementById(id) : null;
    return section ? { link, section } : null;
  })
  .filter(Boolean);

if (sectionsById.length && "IntersectionObserver" in window) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const match = sectionsById.find((s) => s.section === entry.target);
        if (!match) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          match.link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sectionsById.forEach(({ section }) => spyObserver.observe(section));
}

// Menu mobile
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");
if (menuToggle && navbar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navbar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// FAQ accordion
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-question");
  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      openItem.classList.remove("open");
      openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// Busca de benefícios — carrega os benefícios ativos do Supabase e filtra
// por categoria no cliente (o catálogo do clube é pequeno o bastante pra isso).
const beneficiosGrid = document.getElementById("beneficios-grid");
const beneficiosStatus = document.getElementById("beneficios-status");
let todosBeneficios = [];

function formatDesconto(b) {
  if (!b.valor_desconto) return b.condicoes || "Benefício especial";
  if (b.tipo_desconto === "percentual") return `${b.valor_desconto}% de desconto`;
  if (b.tipo_desconto === "valor_fixo")
    return `R$ ${Number(b.valor_desconto).toFixed(2).replace(".", ",")} de desconto`;
  return b.condicoes || "Benefício especial";
}

function formatPreco(preco) {
  return preco > 0 ? `R$ ${Number(preco).toFixed(2).replace(".", ",")}` : "Grátis";
}

function renderBeneficios(lista) {
  if (!beneficiosGrid) return;

  if (!lista.length) {
    beneficiosGrid.innerHTML = "";
    beneficiosStatus.textContent = "Nenhum benefício encontrado nessa categoria ainda.";
    beneficiosStatus.className = "beneficios-status is-empty";
    return;
  }

  beneficiosStatus.textContent = "";
  beneficiosStatus.className = "beneficios-status";
  beneficiosGrid.innerHTML = lista
    .map((b) => {
      const categoria = b.categorias;
      const parceiro = b.parceiros;
      return `
        <article class="beneficio-card">
          <span class="cat-tag"><i data-lucide="${categoria?.icone || "compass"}" data-size="14"></i> ${categoria?.nome || "Geral"}</span>
          <h3>${b.titulo}</h3>
          <p class="parceiro">${parceiro?.nome_negocio || "Noronha Promo"}</p>
          <p class="desconto">${formatDesconto(b)}</p>
          <p class="preco">${formatPreco(b.preco)}</p>
          <a class="cta" href="/portal/login/cadastro">Criar conta para aproveitar <i data-lucide="arrow-right" data-size="14"></i></a>
        </article>
      `;
    })
    .join("");
  renderIcons(beneficiosGrid);
}

async function carregarBeneficios() {
  if (!beneficiosGrid) return;
  const { data, error } = await sb
    .from("beneficios")
    .select("*, categorias(nome, icone, slug), parceiros(nome_negocio)")
    .eq("status", "ativo")
    .order("created_at", { ascending: false });

  if (error) {
    beneficiosStatus.textContent = "Não foi possível carregar os benefícios agora.";
    beneficiosStatus.className = "beneficios-status is-error";
    return;
  }

  todosBeneficios = data || [];
  renderBeneficios(todosBeneficios);
}

carregarBeneficios();

const formBusca = document.getElementById("form-busca");
if (formBusca) {
  formBusca.addEventListener("submit", (e) => {
    e.preventDefault();
    const categoria = document.getElementById("categoria").value;
    const filtrados =
      categoria === "todas"
        ? todosBeneficios
        : todosBeneficios.filter((b) => b.categorias?.slug === categoria);
    renderBeneficios(filtrados);
    document.getElementById("beneficios").scrollIntoView({ behavior: "smooth" });
  });
}

// Lista de interesse (captura de leads)
const formLista = document.getElementById("form-lista");
const formStatus = document.getElementById("form-status");
if (formLista) {
  formLista.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const consentimento = document.getElementById("consentimento").checked;

    if (!nome || !email || !consentimento) {
      formStatus.textContent = "Preencha nome, e-mail e aceite os termos.";
      formStatus.className = "form-status error";
      return;
    }

    const submitBtn = formLista.querySelector("button[type=submit]");
    submitBtn.disabled = true;

    const { error } = await sb.from("leads").insert({ nome, email, consentimento });

    submitBtn.disabled = false;

    if (error) {
      formStatus.textContent = "Não foi possível enviar agora. Tente de novo em instantes.";
      formStatus.className = "form-status error";
      return;
    }

    formStatus.textContent = "Cadastro recebido! Em breve entraremos em contato.";
    formStatus.className = "form-status success";
    formLista.reset();
  });
}

// Seja um parceiro (cria o negócio como pendente, aguardando aprovação)
const formParceiro = document.getElementById("form-seja-parceiro");
const formParceiroStatus = document.getElementById("form-parceiro-status");
if (formParceiro) {
  formParceiro.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome_negocio = document.getElementById("p-nome-negocio").value.trim();
    const categoriaSlug = document.getElementById("p-categoria").value;
    const email = document.getElementById("p-email").value.trim();
    const telefone = document.getElementById("p-telefone").value.trim();
    const mensagem = document.getElementById("p-mensagem").value.trim();

    if (!nome_negocio || !email) {
      formParceiroStatus.textContent = "Preencha ao menos o nome do negócio e o e-mail.";
      formParceiroStatus.className = "form-status error";
      return;
    }

    const submitBtn = formParceiro.querySelector("button[type=submit]");
    submitBtn.disabled = true;

    let categoria_id = null;
    if (categoriaSlug) {
      const { data: categoria } = await sb
        .from("categorias")
        .select("id")
        .eq("slug", categoriaSlug)
        .single();
      categoria_id = categoria?.id ?? null;
    }

    const { error } = await sb.from("parceiros").insert({
      nome_negocio,
      categoria_id,
      email,
      telefone: telefone || null,
      descricao: mensagem || null,
      status: "pendente",
    });

    submitBtn.disabled = false;

    if (error) {
      formParceiroStatus.textContent = "Não foi possível enviar agora. Tente de novo em instantes.";
      formParceiroStatus.className = "form-status error";
      return;
    }

    formParceiroStatus.textContent = "Cadastro recebido! Vamos analisar e entrar em contato.";
    formParceiroStatus.className = "form-status success";
    formParceiro.reset();
  });
}
