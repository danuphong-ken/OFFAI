// ── Config ──
const ML_API_KEY  = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMmMxZjI4YTI2YzkwOWM0MDgyYWZhZjM0NmU3ZDcwMDg4MDY5MjBiZDE0NDdmYjA5NzMwZDRmZDNmY2NkNzNjODUxYWI4ZDNhNGM2MDlmMzMiLCJpYXQiOjE3Nzg2ODI5NDguMzkwMzE0LCJuYmYiOjE3Nzg2ODI5NDguMzkwMzE4LCJleHAiOjQ5MzQzNTY1NDguMzgzMDA0LCJzdWIiOiIyMzU3MjYzIiwic2NvcGVzIjpbXX0.Wh7yZtoOxM2Kev2VO9E_hWKoCz8L-2i_WZfnm03vZ7uARdAH4C8oFuBNoOQOycvH8hhBeNOnxFnRYKKhbAQaib9sXM4RymdSUVta0KqwNLly0fcs_WZG7SRcgPvX7ZhbvCKHOQHFs2Kgj3FY0Prkqj0GYGbab61gELu8IZPlBHXu_DMXeScxSoc5SvXsDPHP8JONxbj5ONQJc66vVRCRRcjUXUPBWhc1TobB_8KI2Nhf8QA_U3TzvmImbemb726EQbAGx4yetD4PJLnsfahTjBusKnrn5vFMpPCWwqGQ5JqsvySItk5ZDi4xBzh6feJ4nkO2pt530iha3AyI-GahjHeJlHxwono3XgHdiRQOC0tSL5jAaYbBNkrq_gtv9bYgBvtLZSOA3GKCihpI093lHz8yLn8lIAi1HrSCyAk5LGYYQg9GiQXQWqJ-QCL8roSqsjQlGxvBs8nf_-To5_qTqYftvPxtkBtDq1t0QWPJPaQZEWBzrPfJ_gxzIMGwcE4n3LUYHhvVwB3a08huve-kf8miFD-d7E3tsT3nOHDEPzI20PGriVLswct-Jfrf-L-GgCk243075Y0LYG_6h6ra04FECNglFVLQNCK0KKSbH4t7Nd4uzTxx8yKgcYZkiQdIaAtJzC915Po7U7E9sYJsFqvXWvWD-z97vxIwKMbR6nE';
const ML_GROUP_ID = '187182560057492878';

// ⚠️ วาง Web App URL จาก Apps Script ตรงนี้หลัง Deploy
const INTERVIEW_URL = 'https://script.google.com/macros/s/AKfycbypKA3QKKHqU6IcyQfCZqgKRCK59ZZ8Id1iqMBFMd5h6Nh7CTCvXjQPLsA7r4iU-jK7/exec'

document.addEventListener('DOMContentLoaded', () => {

    // ── Elements ──
    const step1     = document.getElementById('step1');
    const step2     = document.getElementById('step2');
    const step3     = document.getElementById('step3');
    const form      = document.getElementById('waitlistForm');
    const btn       = document.getElementById('waitlistBtn');
    const countEl   = document.getElementById('waitlistCount');
    const countEl2  = document.getElementById('waitlistCount2');

    let currentEmail = '';
    let count = parseInt(localStorage.getItem('wl_count') || '47');
    if (countEl)  countEl.textContent  = count;
    if (countEl2) countEl2.textContent = count;

    // ── STEP 1: Email Signup ──
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            currentEmail = form.querySelector('input[type="email"]').value.trim();
            if (!currentEmail) return;

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
                    body: JSON.stringify({ email: currentEmail, groups: [ML_GROUP_ID] })
                });

                if (res.ok) {
                    count += 1;
                    localStorage.setItem('wl_count', count);
                    if (countEl2) countEl2.textContent = count;

                    // Transition ไป Step 2
                    step1.style.opacity = '0';
                    step1.style.transition = 'opacity 0.3s';
                    setTimeout(() => {
                        step1.style.display = 'none';
                        step2.style.display = 'block';
                        step2.style.opacity = '0';
                        step2.style.transition = 'opacity 0.4s';
                        setTimeout(() => { step2.style.opacity = '1'; }, 50);
                        lucide.createIcons();
                    }, 300);
                } else {
                    const errBody = await res.json().catch(() => ({}));
                    console.error('MailerLite error:', res.status, errBody);
                    throw new Error('HTTP ' + res.status + ': ' + (errBody.message || 'Signup failed'));
                }
            } catch (err) {
                console.error(err);
                btn.disabled = false;
                btn.querySelector('.btn-label').textContent = 'เข้าร่วมเลย';
                alert('เกิดข้อผิดพลาด: ' + err.message);
            }
        });
    }

    // ── Choice buttons toggle ──
    document.querySelectorAll('.iq-options').forEach(group => {
        group.querySelectorAll('.iq-opt').forEach(optBtn => {
            optBtn.addEventListener('click', () => {
                group.querySelectorAll('.iq-opt').forEach(b => b.classList.remove('selected'));
                optBtn.classList.add('selected');
            });
        });
    });

    // ── Transition to Step 3 ──
    function goToStep3() {
        step2.style.opacity = '0';
        step2.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            step2.style.display = 'none';
            step3.style.display = 'block';
            step3.style.opacity = '0';
            step3.style.transition = 'opacity 0.4s';
            setTimeout(() => { step3.style.opacity = '1'; }, 50);
        }, 300);
    }

    // ── Skip button ──
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', goToStep3);
    }

    // ── STEP 2: Interview Submit ──
    const interviewForm = document.getElementById('interviewForm');
    const interviewBtn  = document.getElementById('interviewBtn');

    if (interviewForm) {
        interviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const getSelected = (id) => {
                const el = document.querySelector('#' + id + ' .iq-opt.selected');
                return el ? el.dataset.val : '';
            };

            const payload = {
                email:           currentEmail,
                job_title:       document.getElementById('iq_job').value.trim(),
                pain_point:      document.getElementById('iq_pain').value.trim(),
                want_from_offai: document.getElementById('iq_want').value.trim(),
                ai_experience:   getSelected('iq_ai'),
                price_point:     getSelected('iq_price')
            };

            interviewBtn.disabled = true;
            interviewBtn.querySelector('.btn-label').textContent = 'กำลังส่ง...';

            try {
                if (INTERVIEW_URL !== 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
                    await fetch(INTERVIEW_URL, {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                }
            } catch (err) {
                console.error('Interview submit error:', err);
            } finally {
                goToStep3();
            }
        });
    }

    // ── Scroll reveal ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

    // ── Card hover effect ──
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousedown', () => card.style.transform = 'scale(0.98)');
        card.addEventListener('mouseup',   () => card.style.transform = '');
        card.addEventListener('mouseleave',() => card.style.transform = '');
    });
});
