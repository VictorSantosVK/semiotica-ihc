
        document.addEventListener('DOMContentLoaded', function() {
            // Efeito suave de carregamento
            document.body.style.opacity = '0';
            setTimeout(function() {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
            
            // Validação do formulário de newsletter
            const newsletterForm = document.querySelector('.newsletter-form');
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                if(emailInput.value.trim() === '') {
                    alert('Por favor, insira seu e-mail.');
                    emailInput.focus();
                } else {
                    alert('Obrigado por assinar nossa newsletter! Confirme seu e-mail para ativar.');
                    emailInput.value = '';
                }
            });
            
            // Efeito nos botões de compra
            const buyButtons = document.querySelectorAll('.book-btn');
            buyButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const bookTitle = this.closest('.book-card').querySelector('.book-title').textContent;
                    alert(`"${bookTitle}" foi adicionado ao seu carrinho!`);
                });
            });
        });
   