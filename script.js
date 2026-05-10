// ── Waitlist Form Handler ──
// 1. ไปสมัคร formspree.io → New Form → copy Form ID มาใส่ที่นี่
const FORMSPREE_ID = 'mrejozad';

document.addEventListener('DOMContentLoaded', () => {
    const form       = document.getElementById('waitlistForm');
    const btn        = document.getElementById('waitlistBtn');
    const successBox = document.getElementById('waitlistSuccess');
    const countEl    = document.getElementById('waitlistCount');

    // อ่านจำนวนคนจาก localStorage และ +1 ทุกครั้งที่มี signup ใหม่
    let count = parseInt(localStorage.getItem('wl_count') || '47');
    if (countEl) countEl.textContent = count;

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]').value.trim();
            if (!email) return;

            // Loading state
            btn.disabled = true;
            btn.querySelector('.btn-label').textContent = 'Joining...';

            try {
                const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (res.ok) {
                    // แสดง success message
                    form.style.display = 'none';
                    successBox.classList.add('show');
                    lucide.createIcons(); // re-render icon ใน success box

                    // อัปเดตจำนวนคน
                    count += 1;
                    localStorage.setItem('wl_count', count);
                    if (countEl) countEl.textContent = count;
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                // Fallback: ถ้ายังไม่ได้ตั้ง Formspree — แสดง success ทดสอบได้เลย
                console.warn('Formspree not configured yet. Showing success for demo.', err);
                form.style.display = 'none';
                successBox.classList.add('show');
                lucide.createIcons();
                count += 1;
                localStorage.setItem('wl_count', count);
                if (countEl) countEl.textContent = count;
            }
        });
    }


    // Reveal sections on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

    // Add click effect to cards
    document.querySelectorAll('.item-card, .featured-card').forEach(card => {
        card.addEventListener('mousedown', () => {
            card.style.transform = 'scale(0.98)';
        });
        card.addEventListener('mouseup', () => {
            card.style.transform = '';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
