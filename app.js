// Authentication and PDF Navigation Application
class SecurePDFApp {
    constructor() {
        this.isAuthenticated = false;
        this.correctPassword = "1034";
        this.currentPage = 1;
        this.totalPages = 13;
        
        // DOM Elements
        this.loginScreen = document.getElementById('loginScreen');
        this.pdfApp = document.getElementById('pdfApp');
        this.loginForm = document.getElementById('loginForm');
        this.passwordInput = document.getElementById('password');
        this.errorMessage = document.getElementById('errorMessage');
        
        // PDF Navigation Elements
        this.pages = document.querySelectorAll('.page');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageInfo = document.getElementById('pageInfo');
        this.printBtn = document.getElementById('printBtn');
        
        this.init();
    }

    init() {
        // Initialize authentication
        this.setupAuthentication();
        
        // Initialize PDF navigation (will be enabled after authentication)
        this.setupPDFNavigation();
        
        // Show login screen initially
        this.showLogin();
    }

    setupAuthentication() {
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Allow Enter key to submit
        this.passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleLogin();
            }
        });

        // Clear error message when user starts typing
        this.passwordInput.addEventListener('input', () => {
            this.clearError();
        });
    }

    handleLogin() {
        const enteredPassword = this.passwordInput.value.trim();
        
        if (enteredPassword === this.correctPassword) {
            this.authenticateUser();
        } else {
            this.showError();
        }
    }

    authenticateUser() {
        this.isAuthenticated = true;
        this.hideLogin();
        this.showPDFApp();
        
        // Initialize PDF navigation after successful login
        this.updatePage();
        this.updateNavButtons();
        
        console.log('✅ Accesso autorizzato - Piano Alimentare Emanuela e Federico');
    }

    showError() {
        this.errorMessage.textContent = "ACCESSO NEGATO - Password non corretta";
        this.errorMessage.classList.remove('hidden');
        this.passwordInput.value = '';
        this.passwordInput.focus();
        
        // Add shake effect to login container
        const loginContainer = document.querySelector('.login-container');
        loginContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginContainer.style.animation = '';
        }, 500);
    }

    clearError() {
        this.errorMessage.classList.add('hidden');
    }

    showLogin() {
        this.loginScreen.classList.remove('hidden');
        this.pdfApp.classList.add('hidden');
        this.passwordInput.focus();
    }

    hideLogin() {
        this.loginScreen.classList.add('hidden');
    }

    showPDFApp() {
        this.pdfApp.classList.remove('hidden');
        this.scrollToTop();
    }

    setupPDFNavigation() {
        // Set up navigation button listeners
        this.prevBtn?.addEventListener('click', () => {
            if (this.isAuthenticated) this.previousPage();
        });
        
        this.nextBtn?.addEventListener('click', () => {
            if (this.isAuthenticated) this.nextPage();
        });
        
        this.printBtn?.addEventListener('click', () => {
            if (this.isAuthenticated) this.printPDF();
        });
        
        // Set up index navigation
        this.setupIndexNavigation();
    }

    setupIndexNavigation() {
        const indexItems = document.querySelectorAll('.index-item');
        indexItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!this.isAuthenticated) return;
                
                const targetPage = parseInt(item.getAttribute('data-page'));
                if (targetPage && targetPage >= 1 && targetPage <= this.totalPages) {
                    this.goToPage(targetPage);
                }
            });
        });
    }

    goToPage(pageNumber) {
        if (!this.isAuthenticated || pageNumber < 1 || pageNumber > this.totalPages) {
            return;
        }
        
        this.currentPage = pageNumber;
        this.updatePage();
        this.updateNavButtons();
        this.scrollToTop();
    }

    previousPage() {
        if (!this.isAuthenticated) return;
        
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePage();
            this.updateNavButtons();
            this.scrollToTop();
        }
    }

    nextPage() {
        if (!this.isAuthenticated) return;
        
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePage();
            this.updateNavButtons();
            this.scrollToTop();
        }
    }

    updatePage() {
        if (!this.isAuthenticated) return;
        
        // Hide all pages
        this.pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show current page
        const currentPageElement = document.getElementById(`page${this.currentPage}`);
        if (currentPageElement) {
            currentPageElement.classList.add('active');
        }
        
        // Update page info
        if (this.pageInfo) {
            this.pageInfo.textContent = `Pagina ${this.currentPage} di ${this.totalPages}`;
        }
    }

    updateNavButtons() {
        if (!this.isAuthenticated) return;
        
        // Update previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentPage === 1;
        }
        
        // Update next button
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentPage === this.totalPages;
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    printPDF() {
        if (!this.isAuthenticated) return;
        
        try {
            // Store current state
            const originalPage = this.currentPage;
            const body = document.body;
            const navControls = document.querySelector('.navigation-controls');
            
            // Add print class to body
            body.classList.add('printing');
            
            // Hide navigation temporarily
            if (navControls) {
                navControls.style.display = 'none';
            }
            
            // Show all pages for printing
            this.pages.forEach(page => {
                page.classList.add('active');
            });
            
            // Small delay to ensure layout is ready
            setTimeout(() => {
                // Trigger browser print dialog
                window.print();
                
                // Restore original state after print dialog
                setTimeout(() => {
                    // Remove print class
                    body.classList.remove('printing');
                    
                    // Show navigation again
                    if (navControls) {
                        navControls.style.display = 'flex';
                    }
                    
                    // Hide all pages except current
                    this.pages.forEach(page => {
                        page.classList.remove('active');
                    });
                    
                    // Show current page
                    this.goToPage(originalPage);
                }, 500);
            }, 100);
            
        } catch (error) {
            console.error('Errore durante la stampa:', error);
            // Fallback: just trigger print
            window.print();
        }
    }

    // Keyboard navigation
    handleKeyPress(event) {
        if (!this.isAuthenticated) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.previousPage();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextPage();
                break;
            case 'Home':
                event.preventDefault();
                this.goToPage(1);
                break;
            case 'End':
                event.preventDefault();
                this.goToPage(this.totalPages);
                break;
        }
    }
}

// Page titles for better navigation
const pageTitles = {
    1: "Copertina",
    2: "Indice", 
    3: "Dati Antropometrici",
    4: "Timing Pasti",
    5: "Giorno 1 - Allenamento",
    6: "Giorno 2 - Standard",
    7: "Giorno 3 - Allenamento", 
    8: "Giorno 4 - Standard",
    9: "Giorno 5 - Allenamento",
    10: "Giorno 6 - Standard",
    11: "Giorno 7 - Libera",
    12: "Ricette Base",
    13: "Consigli Generali"
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const app = new SecurePDFApp();
    
    // Add keyboard navigation (only when authenticated)
    document.addEventListener('keydown', (event) => {
        // Don't interfere with login form
        if (event.target.type === 'password') {
            return;
        }
        
        app.handleKeyPress(event);
    });
    
    // Alternative print trigger with Ctrl+P (only when authenticated)
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            if (app.isAuthenticated) {
                event.preventDefault();
                app.printPDF();
            }
        }
    });
    
    // Add touch/swipe support for mobile (only when authenticated)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (event) => {
        if (!app.isAuthenticated) return;
        touchStartX = event.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (event) => {
        if (!app.isAuthenticated) return;
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - previous page
                app.previousPage();
            } else {
                // Swipe left - next page
                app.nextPage();
            }
        }
    }
    
    // Add visual feedback for better UX
    const buttons = document.querySelectorAll('.nav-btn, .print-btn, .login-btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add click feedback for index items
    const indexItems = document.querySelectorAll('.index-item');
    indexItems.forEach(item => {
        item.addEventListener('mousedown', function() {
            if (app.isAuthenticated) {
                this.style.transform = 'translateX(8px) scale(0.98)';
            }
        });
        
        item.addEventListener('mouseup', function() {
            if (app.isAuthenticated) {
                this.style.transform = 'translateX(4px) scale(1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Enhanced print functionality
    window.addEventListener('beforeprint', function() {
        if (!app.isAuthenticated) return;
        
        document.body.classList.add('printing');
        // Show all pages when printing
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.add('active'));
    });
    
    window.addEventListener('afterprint', function() {
        if (!app.isAuthenticated) return;
        
        document.body.classList.remove('printing');
        // Restore single page view
        setTimeout(() => {
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            app.goToPage(app.currentPage);
        }, 100);
    });
    
    console.log('🔐 Sistema di Autenticazione Caricato');
    console.log('📄 Piano Alimentare Emanuela e Federico - In attesa di autenticazione');
});

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
        20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
`;
document.head.appendChild(style);