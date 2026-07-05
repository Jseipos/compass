# Compass — Journey Map Design Doc

## Core Philosophy

The journey map is not a progress bar. It's not a level system. It's not "you're 60% of the way to being fixed."

It's a landscape. Your data puts you somewhere. The somewhere speaks for itself. You don't level up — you walk somewhere new, or somewhere you've been before.

**The reward is for showing up. Not for feeling better.**

Every entry you write, no matter your mood score, no matter how short — you gathered something. Your plant grew. Bad mood, good mood, one sentence, three paragraphs. You showed up, you foraged, your plant is more rooted than before.

Someone in the Misty Forest for two straight weeks isn't falling behind. They're collecting rainwater. Their plant is drinking deep. Maybe deeper than the one in the Wildflower Field getting easy sunlight.

---

## The Places

### The Doorway
- **Vibe:** You just got here. That's enough.
- **Visual:** A simple door or gate, soft light behind it. Bare ground.
- **What you find:** Soil. Just soil. The first thing. Everything grows from this.
- **Data trigger:** Onboarding complete, no entries yet.
- **Plant effect:** Your plant is a seed in fresh earth.

### Misty Forest
- **Vibe:** You're here even though it's heavy. The trees are tall, the air is damp, you can't see far ahead. But you're walking. You're writing. The mist doesn't make you feel worse — it's just where you are today.
- **Visual:** Tall trees, soft fog, muted greens. Not gloomy — quiet and protected.
- **What you find:** Rainwater. Slow, cold, collected drop by drop. Not glamorous but it's what roots need.
- **Data trigger:** Low mood and/or low energy scores with consistent entries. You're logging even though it's hard.
- **Plant effect:** Deep roots. Rainwater feeds the root system. A plant that's been through the misty forest has the deepest roots.

### Riverbank
- **Vibe:** Things are moving. Not fast, not slow. Some days the current pulls, some days you're watching it go by. But you're here, feet in the water, tracking it.
- **Visual:** Running water, smooth stones, willows. Open sky above the river.
- **What you find:** River stones. Smooth, worn down by time. You place them around your plant's base. They hold moisture, keep the soil steady.
- **Data trigger:** Mixed mood scores, consistent entries. Things are flowing, not stuck, not soaring.
- **Plant effect:** Sturdy base. River stones settle around the plant. A plant that's been to the riverbank has a solid foundation.

### Wildflower Field
- **Vibe:** Light. Open. You can breathe. The prompts are hitting and you're writing real stuff. Not every moment is perfect but the sky is big.
- **Visual:** Open meadow, wildflowers, big sky, warm light.
- **What you find:** Sunlight and pollen. Warm, golden, alive. Your plant stretches toward it.
- **Data trigger:** Rising mood and/or energy trend, consistent engagement. Things are genuinely lighter.
- **Plant effect:** Taller stem, brighter leaves. A plant that's been to the field grows upward.

### Mountain Trail
- **Vibe:** Hard climb but you can see the valley below. You've been at this long enough that the hard days don't erase what you can see from up here.
- **Visual:** Switchback trail, pine trees, rocky outcrops, distant valley view.
- **What you find:** Pine needles and moss. Rich, slow-built, earned from altitude. You lay them down as mulch. Your plant's roots stay warm through the cold spells.
- **Data trigger:** Experienced user (15+ entries) with a recent mood/energy dip but stable long-term trend. The dip doesn't erase the work.
- **Plant effect:** Hardened, resilient. Mulch protects the base. A plant that's been to the mountain trail weathers the next storm better.

### Old Growth Grove
- **Vibe:** Deep roots. Stable ground. Storms come through and you feel them but they don't knock you down. You know this forest. It's yours.
- **Visual:** Massive trees, dappled light, thick undergrowth, fallen logs with new growth on them.
- **What you find:** Seeds. From the trees that have been here longer than you. You plant them beside your plant. Not for now — for later. For the next hard season.
- **Data trigger:** Sustained engagement (20+ entries) with low variance in mood/energy scores. Not perfect scores — just stable ground.
- **Plant effect:** Abundance. Seeds sprout beside the main plant. A plant in the grove isn't alone anymore.

---

## How Place Is Determined

Places are NOT linear stages. You don't progress through them in order. Your data places you somewhere based on:

1. **Entry count** — Total entries written (gates The Doorway vs everywhere else, and contributes to Mountain Trail / Old Growth Grove eligibility)
2. **Mood trend** — Average mood over last 5 entries vs first 5 entries (direction matters)
3. **Energy trend** — Same as mood
4. **Consistency** — Are entries recent and regular, or sporadic?
5. **Variance** — How much mood/energy scores swing entry to entry

### Priority Logic (evaluated each entry)
1. If no entries → **The Doorway**
2. If 20+ entries AND low variance AND stable trend → **Old Growth Grove**
3. If 15+ entries AND recent dip but stable long-term → **Mountain Trail**
4. If mood/energy trending up → **Wildflower Field**
5. If mood/energy low but consistent entries → **Misty Forest**
6. If mixed/stable scores with consistent entries → **Riverbank**

You can move between any places. The Weather (a hard stretch) isn't a place — it's weather that can happen anywhere. But the Misty Forest IS where you go when the weather is heavy and you're logging anyway.

---

## The Foraging Loop

1. User writes an entry (any length, any mood score)
2. After saving, a quiet animation plays — something drifts toward the plant
   - Misty Forest: raindrops falling
   - Riverbank: a stone settling into place
   - Wildflower Field: pollen catching light
   - Mountain Trail: pine needles falling
   - Old Growth Grove: a seed dropping into soil
   - The Doorway: soil settling around the seed
3. No fanfare. No "ACHIEVEMENT UNLOCKED." Just... something landed.
4. The plant's appearance changes subtly over time based on what it's collected
   - Deep roots from rainwater
   - Sturdy base from river stones
   - Height from sunlight
   - Resilient coating from pine mulch
   - Companions from seeds

The plant is a cumulative record of everywhere you've been. Not just where you are now.

---

## Visual Design Notes

### Home Screen — The Porthole
- The journey map appears as a **circular icon** on the home screen — like a porthole looking into your current place
- Inside the circle: your plant in its current terrain, tiny but alive
- Place name + one sentence underneath: "You're in the misty forest. You showed up anyway. That's the whole thing."
- No progress bar. No "you're 60% to the grove."
- Returning users see their place first and feel oriented. "Oh, I'm at the riverbank again."
- The place is never a demotion. It's weather. It's terrain. It's just where you are.

### Full Screen Scene — Tap to Enter
- Tapping the porthole opens a **full-screen animated scene** — not a repeat of the icon, but a living, breathing version of the place
- Feels like stepping into the landscape. Ambient, calming, slow.
- Not a game. Not a reward animation. A place to rest.
- Someone opens it, watches for 30 seconds, breathes, closes it. That's the whole interaction.

### Scene Animation Concepts
- **The Doorway** — Soft light pulsing behind a door, particles floating toward it
- **Misty Forest** — Trees barely swaying, fog drifting sideways, occasional droplet catching light
- **Riverbank** — Water rippling, leaves floating past, reflection shimmering
- **Wildflower Field** — Flowers bobbing in a breeze, pollen drifting, clouds moving slow
- **Mountain Trail** — Wind through pines, distant bird, light shifting through canopy
- **Old Growth Grove** — Dust motes in dappled light, slow canopy sway, utter stillness

### Ambient Audio
- Not songs. Ambient drones that match the terrain without being heavy.
- **Misty Forest** — Rain and distant thunder rumble, muffled
- **Riverbank** — Running water, gentle current, occasional bird
- **Wildflower Field** — Breeze through grass, bees, warm silence
- **Mountain Trail** — Wind through pines, sparse birdsong
- **Old Growth Grove** — Deep stillness, creaking branches, wind high above
- **The Doorway** — Soft hum, almost silence
- Could be generated with Web Audio API (no audio files to ship) or short looping ambient clips
- Audio is opt-in. Defaults to off. A small speaker icon in the corner of the full-screen scene.

### Terrain Transitions
- The terrain changes when your data changes. Not instantly — it eases.
- You don't snap from Wildflower Field to Misty Forest because you had one bad day.
- The porthole gradually shifts over 3-5 entries worth of data change.

---

## What We're NOT Doing

- No streak punishment. Dormant isn't dead.
- No "level up" notifications.
- No leaderboards, social, or comparison.
- No clinical language. No "progress," "improvement," "scores."
- No forcing linear progression. You can cycle between places indefinitely.
- No " graduation" from the app. The grove isn't the end. You can always go back to the misty forest.

---

## Open Questions

- How many entries before terrain transitions? (Probably 3-5 recent entries should influence placement, not just the latest one)
- Should we show the user all the places, or just where they are now? (Leaning: just where you are. Discovery is part of it.)
- How do we handle the very first entry? They're coming from The Doorway — where do they go? (Probably Misty Forest or Riverbank depending on first mood score)
- Should the plant's accumulated items be visible, or just reflected in its overall appearance? (Leaning: visible on close inspection, subtle from a distance)
- Animation style — SVG-based, keeping it consistent with current Plant.tsx, or something richer?

---

## Technical Notes

- Built on top of existing Plant.tsx component (currently 5 growth stages based on entry count)
- Existing EngagementTracker.tsx has the heatmap and milestones — journey map replaces or sits alongside this
- Data needed: entry count, mood scores, energy scores, entry dates — all already stored in IndexedDB
- New storage: collected items per plant (array of {type, place, date, entryId})
- New component: JourneyMap.tsx (or evolve Plant.tsx to include terrain)
- Place calculation: pure function from entry data, cached on each entry save
