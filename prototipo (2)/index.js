document.addEventListener('DOMContentLoaded', function() {
  // Alternar tema claro/escuro
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Verificar preferência do usuário
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');
  
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  themeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
      body.setAttribute('data-theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    } else {
      body.setAttribute('data-theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    }
  });
  
  // Menu mobile
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
  
  // Fechar menu ao clicar em um link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
  
  // Carrinho de compras
  const cartIcon = document.querySelector('.nav-icon[aria-label="Carrinho"]');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const overlay = document.querySelector('.overlay');
  const closeCart = document.querySelector('.close-cart');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-total span');
  const cartCount = document.querySelector('.cart-count');
  
  let cart = [];
  
  // Abrir/fechar carrinho
  cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
  
  overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
  
  // Adicionar item ao carrinho
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const bookCard = button.closest('.book-card');
      const title = bookCard.querySelector('.book-title').textContent;
      const author = bookCard.querySelector('.book-author').textContent;
      const priceText = bookCard.querySelector('.book-price').textContent;
      const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
      const coverSrc = bookCard.querySelector('.book-cover img').src;
      
      // Verificar se o item já está no carrinho
      const existingItem = cart.find(item => item.title === title);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          title,
          author,
          price,
          coverSrc,
          quantity: 1
        });
      }
      
      updateCart();
      
      // Feedback visual
      button.textContent = 'Adicionado!';
      button.style.backgroundColor = '#27ae60';
      
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Adicionar ao Carrinho';
        button.style.backgroundColor = '';
      }, 2000);
    });
  });
  
  // Atualizar carrinho
  function updateCart() {
    // Limpar carrinho
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    let itemCount = 0;
    
    // Adicionar itens
    cart.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.coverSrc}" alt="${item.title}">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.title}</h4>
          <p class="cart-item-author">${item.author}</p>
          <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
          <div class="cart-item-actions">
            <div class="cart-item-quantity">
              <button class="quantity-btn decrease" data-index="${index}">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn increase" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      
      cartItemsContainer.appendChild(itemElement);
      total += item.price * item.quantity;
      itemCount += item.quantity;
    });
    
    // Atualizar total e contador
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    cartCount.textContent = itemCount;
    cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    
    // Adicionar eventos para os botões de quantidade e remoção
    document.querySelectorAll('.decrease').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
          updateCart();
        }
      });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.dataset.index;
        cart[index].quantity += 1;
        updateCart();
      });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.dataset.index;
        cart.splice(index, 1);
        updateCart();
      });
    });
  }
  
  // Botão de voltar ao topo
  const backToTopButton = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('active');
    } else {
      backToTopButton.classList.remove('active');
    }
  });
  
  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Contador para ofertas
  function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    let hours = 5;
    let minutes = 0;
    let seconds = 0;
    
    const timer = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            clearInterval(timer);
            countdownElement.textContent = "Oferta encerrada!";
            return;
          }
          hours--;
          minutes = 59;
        } else {
          minutes--;
        }
        seconds = 59;
      } else {
        seconds--;
      }
      
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      
      countdownElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }, 1000);
  }
  
  updateCountdown();
  
  // Efeito de scroll suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Ativar link ativo na navegação
  const sections = document.querySelectorAll('section');

  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Animação ao rolar a página
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.book-card, .category-card, .info-card, .offer-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Definir estado inicial para animação
  document.querySelectorAll('.book-card, .category-card, .info-card, .offer-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Executar uma vez ao carregar a página
  
  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      
      // Simular envio
      this.innerHTML = `
        <div class="newsletter-success">
          <i class="fas fa-check-circle"></i>
          <p>Obrigado por assinar nossa newsletter!</p>
        </div>
      `;
      
      // Resetar após 5 segundos
      setTimeout(() => {
        this.innerHTML = `
          <div class="input-group">
            <input type="email" placeholder="Seu melhor e-mail" required />
            <button type="submit" class="newsletter-btn">
              <i class="fas fa-paper-plane"></i> Assinar
            </button>
          </div>
          <div class="newsletter-checkbox">
            <input type="checkbox" id="agree-terms" required>
            <label for="agree-terms">Concordo em receber comunicações</label>
          </div>
        `;
      }, 5000);
    });
  }
  
  // Contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simular envio
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      
      setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
        
        setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
          this.reset();
        }, 2000);
      }, 1500);
    });
  }
});