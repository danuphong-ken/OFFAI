// ── Waitlist Form Handler — MailerLite Direct ──
const ML_API_KEY  = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMmMxZjI4YTI2YzkwOWM0MDgyYWZhZjM0NmU3ZDcwMDg4MDY5MjBiZDE0NDdmYjA5NzMwZDRmZDNmY2NkNzNjODUxYWI4ZDNhNGM2MDlmMzMiLCJpYXQiOjE3Nzg2ODI5NDguMzkwMzE0LCJuYmYiOjE3Nzg2ODI5NDguMzkwMzE4LCJleHAiOjQ5MzQzNTY1NDguMzgzMDA0LCJzdWIiOiIyMzU3MjYzIiwic2NvcGVzIjpbXX0.Wh7yZtoOxM2Kev2VO9E_hWKoCz8L-2i_WZfnm03vZ7uARdAH4C8oFuBNoOQOycvH8hhBeNOnxFnRYKKhbAQaib9sXM4RymdSUVta0KqwNLly0fcs_WZG7SRcgPvX7ZhbvCKHOQHFs2Kgj3FY0Prkqj0GYGbab61gELu8IZPlBHXu_DMXeScxSoc5SvXsDPHP8JONxbj5ONQJc66vVRCRRcjUXUPBWhc1TobB_8KI2Nhf8QA_U3TzvmImbemb726EQbAGx4yetD4PJLnsfahTjBusKnrn5vFMpPCWwqGQ5JqsvySItk5ZDi4xBzh6feJ4nkO2pt530iha3AyI-GahjHeJlHxwono3XgHdiRQOC0tSL5jAaYbBNkrq_gtv9bYgBvtLZSOA3GKCihpI093lHz8yLn8lIAi1HrSCyAk5LGYYQg9GiQXQWqJ-QCL8roSqsjQlGxvBs8nf_-To5_qTqYftvPxtkBtDq1t0QWPJPaQZEWBzrPfJ_gxzIMGwcE4n3LUYHhvVwB3a08huve-kf8miFD-d7E3tsT3nOHDEPzI20PGriVLswct-Jfrf-L-GgCk243075Y0LYG_6h6ra04FECNglFVLQNCK0KKSbH4t7Nd4uzTxx8yKgcYZkiQdIaAtJzC915Po7U7E9sYJsFqvXWvWD-z97vxIwKMbR6nE';
const ML_GROUP_ID = '187182560057492878';

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
            btn.querySelector('.btn-label').textContent = 'กำลังส่ง...';

            try {
                const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${ML_API_KEY}`
                    },
                    body: JSON.stringify({
                        email: email,
                        groups: [ML_GROUP_ID]
                    })
                });

                // 200 = updated, 201 = created — ทั้งคู่ถือว่าสำเร็จ
                if (res.ok) {
                    form.style.display = 'none';
                    successBox.classList.add('show');
                    lucide.createIcons();
                    count += 1;
                    localStorage.setItem('wl_count', count);
                    if (countEl) countEl.textContent = count;
                } else {
                    const err = await res.json();
                    throw new Error(err.message || 'Submission failed');
                }
            } catch (err) {
                console.error('MailerLite error:', err);
                btn.disabled = false;
                btn.querySelector('.btn-label').textContent = 'เข้าร่วมเลย';
                alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งครับ');
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
