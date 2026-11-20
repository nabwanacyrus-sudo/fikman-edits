from pathlib import Path
p=Path('/mnt/data/fikman_new/index.html')
s=p.read_text()
old='''        <div class="contact-block"><small>FOLLOW & CONNECT</small><a href="https://www.instagram.com/fikman_edits/" target="_blank" rel="noopener">Instagram ↗</a><a href="https://www.tiktok.com/@fikmanedits" target="_blank" rel="noopener">TikTok ↗</a><a href="https://www.facebook.com/share/1CXM2TGAp2/" target="_blank" rel="noopener">Facebook ↗</a><a href="https://youtube.com/@nabwanacyrus" target="_blank" rel="noopener">YouTube ↗</a><a href="https://www.linkedin.com/in/nabwana-cyrus-19348a377/" target="_blank" rel="noopener">LinkedIn ↗</a></div>'''
new='''        <div class="contact-block social-block"><small>FOLLOW & CONNECT</small><div class="social-icons" aria-label="Fikman Edits social media links">
          <a class="social-link instagram" href="https://www.instagram.com/fikman_edits?vrfl=MThnazR0ZG5kam9jeA==" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.7" cy="6.5" r="1" class="social-fill"/></svg></a>
          <a class="social-link tiktok" href="https://www.tiktok.com/@fikmanedits?_r=1&_t=ZS-9B7T3f4tHTY" target="_blank" rel="noopener" aria-label="TikTok" title="TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.1a4.2 4.2 0 1 1-3.6-4.15v3.2a1.1 1.1 0 1 0 .5.95V3h3.1c.2 2.1 1.4 3.5 3.9 3.8v3.1A8 8 0 0 1 14 8.5"/></svg></a>
          <a class="social-link facebook" href="https://www.facebook.com/share/1CXM2TGAp2/" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8z"/></svg></a>
          <a class="social-link youtube" href="https://youtube.com/@nabwanacyrus?si=N5XzeIjBT3uQcSSj" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 8.1a2.8 2.8 0 0 0-2-2C18.2 5.6 12 5.6 12 5.6s-6.2 0-8 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.5 12a29 29 0 0 0 .5 3.9 2.8 2.8 0 0 0 2 2c1.8.5 8 .5 8 .5s6.2 0 8-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-3.9 29 29 0 0 0-.5-3.9z"/><path class="social-cutout" d="m10 15.2 5.2-3.2L10 8.8z"/></svg></a>
          <a class="social-link linkedin" href="https://www.linkedin.com/in/nabwana-cyrus-19348a377?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 8.6H2.1V22h3.1zM3.7 2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6M22 13.8c0-4-2.1-5.9-4.9-5.9a4.2 4.2 0 0 0-3.8 2.1V8.6h-3V22h3.1v-6.6c0-1.7.3-3.4 2.5-3.4s2.2 2 2.2 3.5V22H22z"/></svg></a>
        </div><a class="social-email" href="mailto:nabwanacyrus@gmail.com">nabwanacyrus@gmail.com ↗</a></div>'''
if old not in s: raise SystemExit('social block not found')
s=s.replace(old,new)
needle='''    </section>\n  </main>'''
newsletter='''      <div class="community-signup reveal" id="community">
        <div class="community-copy"><p class="overline">THE FIKMAN COMMUNITY</p><h3>Stay in the <span class="gradient-text">creative loop.</span></h3><p>Sign up for occasional updates on new work, creative insights and Fikman Edits announcements. Every request is reviewed before anyone is added to the mailing list.</p></div>
        <form class="signup-form" name="fikman-community-signup" method="POST" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="fikman-community-signup">
          <p class="form-honeypot" hidden><label>Leave this field empty <input name="bot-field"></label></p>
          <label class="visually-hidden" for="signup-name">Your name (optional)</label><input id="signup-name" name="name" type="text" autocomplete="name" placeholder="Your name (optional)">
          <label class="visually-hidden" for="signup-email">Your email address</label><input id="signup-email" name="email" type="email" autocomplete="email" placeholder="Your email address" required>
          <label class="signup-consent"><input type="checkbox" name="consent" value="yes" required><span>I agree to receive occasional Fikman Edits updates. I understand my request is subject to manual approval.</span></label>
          <button class="button button-primary" type="submit">Request to join <span>↗</span></button>
          <small class="signup-note">No automatic subscription. Your request is sent to Fikman Edits for review.</small>
        </form>
      </div>
    </section>
  </main>'''
if needle not in s: raise SystemExit('main end not found')
s=s.replace(needle,newsletter,1)
p.write_text(s)
