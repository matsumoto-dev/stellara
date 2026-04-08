-- Stellara Seed Data
-- Development/testing only. Do not run in production.

-- Pre-generate daily horoscopes for testing (today's date)
insert into daily_horoscopes (sign, date, content, prompt_version) values
  ('aries',       current_date, 'Today brings a surge of creative energy, Aries. The stars encourage you to take that bold step you have been considering.', 'v1.0'),
  ('taurus',      current_date, 'A grounding day awaits you, Taurus. Financial matters may come into focus — trust your practical instincts.', 'v1.0'),
  ('gemini',      current_date, 'Communication flows effortlessly today, Gemini. A meaningful conversation could open unexpected doors.', 'v1.0'),
  ('cancer',      current_date, 'Your intuition is especially sharp today, Cancer. Pay attention to the subtle signals from those around you.', 'v1.0'),
  ('leo',         current_date, 'The spotlight finds you naturally today, Leo. Use this energy to inspire others rather than seeking applause.', 'v1.0'),
  ('virgo',       current_date, 'Details matter more than usual today, Virgo. Your analytical skills could solve a problem others have overlooked.', 'v1.0'),
  ('libra',       current_date, 'Balance is your theme today, Libra. A relationship dynamic may shift in a way that ultimately serves harmony.', 'v1.0'),
  ('scorpio',     current_date, 'Deep transformation continues, Scorpio. What feels like an ending may actually be the beginning of something powerful.', 'v1.0'),
  ('sagittarius', current_date, 'Adventure calls today, Sagittarius. Even small explorations can expand your perspective in meaningful ways.', 'v1.0'),
  ('capricorn',   current_date, 'Steady progress defines your day, Capricorn. Your discipline is about to pay off in a way you did not expect.', 'v1.0'),
  ('aquarius',    current_date, 'Innovation sparks today, Aquarius. An unconventional idea you have been sitting on deserves another look.', 'v1.0'),
  ('pisces',      current_date, 'Your empathic nature shines today, Pisces. Creative expression could be a beautiful outlet for your deep feelings.', 'v1.0')
on conflict (sign, date) do nothing;
