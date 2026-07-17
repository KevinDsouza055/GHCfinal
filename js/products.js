/* ============================================================
   GRACE HOME CANDLES — PRODUCT ENGINE v3
   Supabase-first. Variants + Bundles. Zero hardcoding.
   ============================================================ */
'use strict';

/* ── Fallback data (used ONLY when Supabase is not configured) ── */
const FALLBACK_PRODUCTS = [
  { id:'azure-bloom', name:'Azure Bloom', type:'single', category:'jars',
    notes:'Jar Candle (350ml)', short_desc:'Stunning blue-tinted candle with artisan aesthetics.', family: 'Fresh',
    description:'Azure Bloom is a hand-poured 350ml jar candle finished in a striking blue-tinted wax that catches the light from every angle. Each candle is poured in small batches at our Mumbai studio, so no two jars are ever exactly alike.<br><br>The fragrance opens with crisp, fresh top notes before settling into a calm, airy base that fills a mid-sized room without overwhelming it. It burns cleanly and evenly, making it a dependable everyday candle rather than a one-off novelty.<br><br>Azure Bloom works beautifully on a bedside table, a reading nook, or a bathroom shelf where you want a quiet moment of calm. It also makes a thoughtful self-care gift for anyone who appreciates understated, artisan home fragrance.',

    burn_time:'35-40 hours', size:'350ml / approx. 320g', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:799, sale_price:599, badges:['Best Seller', 'Relaxing'],
    perfect_for: ['Bedroom', 'Self Care', 'Meditation'],
    image:'assets/azurebloom.jpg',
    is_active:true, is_featured:true, sort_order:5 },

  { id:'eternal-embrace', name:'Eternal Embrace', type:'single', category:'moulds',
    notes:'Mould Candle', short_desc:'Timeless sculptural piece for your home.', family: 'Unscented',
    description:'Eternal Embrace is a sculptural mould candle designed to be a statement piece in its own right, not just a light source. It is hand-cast in pure soy-coconut wax and finished with clean, timeless lines that suit both modern and traditional interiors.<br><br>Because it is unscented, it burns without competing with other fragrances in your home, making it a versatile choice for dining tables, entryways, or gift hampers where you want elegance without an overpowering scent.<br><br>Its smooth silhouette holds its shape well even as it burns down, so it continues to look intentional on your shelf long after the first light. It is a popular pick for anniversaries, housewarmings, and milestone gifts.',

    burn_time:'20-25 hours', size:'Approx. 250g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:649, sale_price:449, badges:['Home Decor', 'Artistic'],
    perfect_for: ['Living Room', 'Gifting', 'Anniversaries'],
    image:'assets/eternalembrace.jpg',
    is_active:true, is_featured:true, sort_order:6 },

  { id:'ivory-rose', name:'Ivory Rose', type:'single', category:'moulds',
    notes:'Mould Candle (1pc)', short_desc:'Elegant rose sculpture in pure soy-coconut wax.', family: 'Floral',
    description:'Ivory Rose is an intricately detailed rose sculpture, hand-poured and hand-finished so every petal edge is crisp and well-defined. It is cast in pure soy-coconut wax, which gives it a soft, matte ivory finish that photographs beautifully.<br><br>The fragrance is a delicate, true-to-bloom rose scent, light enough for a bedside table but present enough to be noticed the moment you walk into the room. It is not overly sweet or synthetic, closer to a fresh-cut rose than a perfume counter.<br><br>Because of the detail work involved, each rose is finished individually by hand, which is part of why it has become one of our most-gifted pieces for Valentine\'s Day, proposals, and romantic anniversaries.',

    burn_time:'15-18 hours', size:'1 piece, approx. 180g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:499, sale_price:299, badges:['Romantic', 'Hand-crafted'],
    perfect_for: ['Bedroom', 'Valentine\'s Day', 'Proposal Gifts'],
    image:'assets/ivoryrose.jpg',
    is_active:true, is_featured:true, sort_order:7 },

  { id:'rose-sculpture', name:'Rose Sculpture', type:'single', category:'moulds',
    notes:'Mould Candle (1pc)', short_desc:'Intricate floral pillar candle.', family: 'Floral',
    description:'This Rose Sculpture pillar candle is shaped into a full, layered bloom for a striking floral silhouette that stands taller and bolder than our smaller rose pieces. It is designed to be a centerpiece rather than an accent, so it holds its own on a dining table or festival altar.<br><br>The fragrance leans slightly sweeter than a classic rose, with soft fruity undertones that make it feel festive rather than purely romantic. It burns evenly from the top down, keeping the sculpted petal detail visible for most of its life.<br><br>It is a favourite for Diwali and wedding season gifting, where its size and presentation do a lot of the work without needing extra packaging.',

    burn_time:'22-26 hours', size:'1 piece, approx. 260g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:599, sale_price:399, badges:['Great Gift', 'Trending'],
    perfect_for: ['Festivals', 'Living Room', 'Gifting'],
    image:'assets/rosesculpture.jpg',
    is_active:true, is_featured:true, sort_order:8 },

  { id:'strawberry-milk', name:'Strawberry Milk', type:'single', category:'jars',
    notes:'Jar Candle (Strawberry Scent, 1pc)', short_desc:'A sweet, creamy blend of fresh strawberries and cold milk (1pc).', family: 'Sweet',
    description:'Strawberry Milk blends the brightness of ripe strawberries with a soft, creamy milk base, landing somewhere between dessert and childhood nostalgia. It is one of the most requested scents in our sweet fragrance family.<br><br>Hand-poured into a single glass jar, the wax pours clean with minimal frosting, and the scent throw is strong enough to fill a kitchen or living room within the first hour of lighting. It is a forgiving, crowd-pleasing fragrance that works for people who find florals too heavy.<br><br>Because of its playful character, it is a popular choice for birthday gifting, dorm rooms, and anyone setting up a cozy first apartment.',

    burn_time:'30-35 hours', size:'1 piece, approx. 200g', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:699, sale_price:399, badges:['New Arrival', 'Great Gift'],
    perfect_for: ['Kitchen', 'Cozy Ambience', 'Birthdays'],
    image:'assets/strawberrymilk.jpg',
    is_active:true, is_featured:true, sort_order:0 },

  { id:'teddy-heart-jar', name:'Teddy Heart Jar Candle', type:'single', category:'jars',
    notes:'Luxury Jar Candle', short_desc:'Adorable teddy heart design for a cozy glow.', family: 'Sweet',
    description:'This luxury jar candle features a playful teddy-and-heart design pressed into the wax surface, making it as much a decor piece as it is a scented candle. It sits in a premium glass jar meant to be reused once the candle is finished.<br><br>The fragrance is warm and sweet without being cloying, designed to create a cozy, wind-down atmosphere in the evening. Because it is a slower, denser pour, the scent throw builds gradually and lingers well after the flame is out.<br><br>Its gift-ready presentation makes it a natural choice for birthdays, "thinking of you" gifts, or anyone who wants their candle to double as a decorative keepsake.',

    burn_time:'38-42 hours', size:'Approx. 300g', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:899, sale_price:699, badges:['New Arrival'],
    image:'assets/teddyheartjarcandle.jpg',
    is_active:true, is_featured:true, sort_order:1 },

  { id:'wedding-couple', name:'Wedding Couple Rose Candle', type:'single', category:'moulds',
    notes:'Sculptural Rose Candle', short_desc:'The perfect gift for anniversaries and weddings.', family: 'Floral',
    description:'The Wedding Couple Rose Candle is a sculptural piece built around two entwined rose forms, symbolising togetherness, which is why it has become one of our go-to wedding and engagement gifts. Each candle is finished by hand to keep the detailing sharp.<br><br>Its fragrance is soft and floral, designed to be pleasant in the background of a gift table or living room rather than dominant. The wax is formulated to hold the sculptural shape well, so it does not collapse or lose form as it burns.<br><br>Couples often keep it unlit for weeks as a display piece before eventually burning it, which is part of why we finish it to a higher presentation standard than our simpler mould candles.',

    burn_time:'20-24 hours', size:'Approx. 240g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:799, sale_price:599, badges:['Great Gift', 'Romantic'],
    image:'assets/weddingcouplerosecandle.jpg',
    is_active:true, is_featured:true, sort_order:12 },

  { id:'coconut-blossom', name:'Coconut Blossom (Real Shell)', type:'single', category:'jars',
    notes:'Natural Shell · Coconut Scent', short_desc:'Tropical paradise in a candle.', family: 'Tropical',
    description:'Coconut Blossom is hand-poured directly into a real, cleaned and cured coconut shell, so every piece has its own natural grain, shape, and texture. No two shells are identical, which is part of the appeal.<br><br>The fragrance is a rich, creamy coconut scent with light tropical undertones, strong enough to transform a room without becoming artificial or overly "beachy." Because the shell itself insulates heat differently from glass, it tends to have a slightly slower, longer burn.<br><br>It is a premium, conversation-starting piece that works well as a centerpiece for coffee tables, patios, or as a standout gift for anyone who loves tropical or resort-style home fragrance.',

    burn_time:'25-30 hours', size:'Natural shell, approx. 150ml capacity', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:899, sale_price:649, badges:['Premium', 'Featured'],
    image:'assets/coconutblossom.jpg',
    is_active:true, is_featured:true, sort_order:13 },

  { id:'daisy-bloom', name:'Daisy Bloom Candle', type:'single', category:'moulds',
    notes:'Floral Aesthetic Candle', short_desc:'Delicate daisy design to brighten any space.', family: 'Floral',
    description:'Daisy Bloom is a delicately moulded floral candle designed to bring a light, cheerful touch to a room without demanding attention the way a large sculptural piece does. Its petals are cast thin and even, giving it a soft, papery-looking finish once cooled.<br><br>The fragrance is fresh and green-floral, closer to a garden after rain than a heavy perfume, which makes it easy to place anywhere from a study desk to a bathroom counter.<br><br>Its smaller size and lighter price point make it a popular add-on gift, paired with a larger candle or included in gift hampers for a fuller look without a big price jump.',

    burn_time:'16-20 hours', size:'Approx. 180g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:799, sale_price:599, badges:['Premium', 'Trending'],
    image:'assets/daisybloomcandle.jpg',
    is_active:true, is_featured:true, sort_order:0 },

  { id:'striped-candle', name:'Striped Pillar Candle', type:'single', category:'moulds',
    notes:'20cm Height · 4cm Diameter', short_desc:'Elegant striped pillar for modern decor.', family: 'Modern',
    description:'This tall striped pillar candle brings a clean, modern edge to your decor with its precise 20cm height and 4cm diameter. The stripe pattern is built into the wax layers themselves rather than painted on, so it stays consistent as the candle burns down.<br><br>It has a restrained, minimal fragrance profile so it does not compete with other scented candles you may already be burning in the same space, making it ideal for styling shelves and consoles.<br><br>Because of its slim, architectural shape, it pairs particularly well in sets of two or three for dining tables, and it is one of our most requested pieces for modern, minimalist home styling.',

    burn_time:'18-22 hours', size:'20cm height x 4cm diameter', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:699, sale_price:499, badges:['New'],
    image:'assets/stripedcandle.jpg',
    is_active:true, is_featured:true, sort_order:3 },

  { id:'teddy-bear', name:'Teddy Bear Candle', type:'single', category:'moulds',
    notes:'Cute Teddy Sculpture', short_desc:'Playful and aesthetic teddy bear mould.', family: 'Sweet',
    description:'The Teddy Bear Candle is a rounded, huggable sculpture cast to keep its soft silhouette even after it starts to burn. It is one of our most photographed pieces on social media thanks to its charm.<br><br>Its fragrance is soft and sweet, close to a light bakery or vanilla scent, chosen specifically to feel warm and comforting rather than sharp or synthetic. It is gentle enough to burn in a child\'s room with adult supervision, or in a nursery when unlit as pure decor.<br><br>It is consistently one of our top-selling gift items, particularly for baby showers, kids\' birthdays, and anyone who wants a candle that feels more like a keepsake than a consumable.',

    burn_time:'12-15 hours', size:'Approx. 150g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:499, sale_price:299, badges:['New Arrival', 'Cute'],
    image:'assets/teddybear.jpg',
    is_active:true, is_featured:true, sort_order:15 },

  { id:'z-shape', name:'Z-Shape Aesthetic Candle', type:'single', category:'moulds',
    notes:'Geometric Design', short_desc:'Unique Z-shaped sculptural candle.', family: 'Modern',
    description:'A bold, geometric Z-shaped candle designed for people who want their home decor to feel curated rather than generic. Its angular form catches light and shadow differently depending on where it is placed, so it looks different by lamp light versus daylight.<br><br>It carries a light, unobtrusive fragrance so it can be displayed unlit as a pure sculptural object or burned occasionally without overpowering a room.<br><br>Because the shape is unusual, it tends to be a talking point when guests visit, and it works especially well displayed alongside plain pillar or jar candles to break up a shelf visually.',

    burn_time:'14-18 hours', size:'Approx. 160g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:499, sale_price:299, badges:['Artistic'],
    image:'assets/aurawave.jpg', // Placeholder for zshape if image missing
    is_active:true, is_featured:true, sort_order:24 },

  

  { id:'blue-blossom', name:'Blue Blossom', type:'single', category:'jars',
    notes:'Jar Candle (350ml)', short_desc:'A vibrant floral escape in every burn.', family: 'Floral',
    description:'Blue Blossom pairs a vivid, blue-toned wax with a vibrant floral fragrance, designed to feel fresh and welcoming rather than heavy or old-fashioned. It is poured in a generous 350ml jar for a longer burn life than our smaller candles.<br><br>The scent opens bright and floral, then settles into a soft, slightly powdery base note that lingers pleasantly in a room without becoming overwhelming. It performs particularly well in living rooms and entryways where first impressions matter.<br><br>Because of its long burn time and consistent scent throw, it has become a repeat-purchase favourite for customers who like keeping one "everyday" candle always lit in a common area.',

    burn_time:'35-40 hours', size:'350ml / approx. 320g', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:799, sale_price:599, badges:['Featured'],
    perfect_for: ['Living Room', 'Guest Welcoming'],
    image:'assets/blueblossom.jpg',
    is_active:true, is_featured:true, sort_order:9 },

  { id:'bubble-pack', name:'Bubble Candle (Pack of 4)', type:'single', category:'moulds',
    notes:'Mould Candle (Scented & Non-Scented)', short_desc:'Modern aesthetic mini-bubble collection.', family: 'Unscented',
    description:'This set of 4 mini bubble candles brings a fun, modern texture to your decor styling, inspired by the bubble-candle trend popular in minimalist and Scandinavian-style interiors. Each piece is small enough to cluster together on a tray or plate.<br><br>Available in both scented and non-scented options, the pack gives you flexibility to mix a lightly-scented piece with unscented ones for a room where you don\'t want competing fragrances.<br><br>Because they come as a set of four, they are ideal for party favours, small thank-you gifts, or simply building out a styled candle cluster without committing to one large piece.',

    burn_time:'6-8 hours per piece', size:'Set of 4, approx. 60g each', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:649, sale_price:449, badges:['Bundle Deal'],
    perfect_for: ['Decor', 'Small Gifts'],
    image:'assets/bubble.jpg',
    is_active:true, is_featured:true, sort_order:10 },

    { id:'daisypetals', name:'Daisy Petals (Pack of 6)', type:'single', category:'moulds',
    notes:'Mould Candle (Scented & Non-Scented)', short_desc:'A fresh and uplifting floral scent.', family: 'Unscented',
    description:'A pack of 6 daisy petal candles carrying a fresh, uplifting floral fragrance, designed as an affordable way to add scattered candlelight around a room or table setting. Each petal-shaped piece is small and lightweight.<br><br>Because they are sold as a set, they work well for styling multiple surfaces at once, such as a dinner table centerpiece, a bathroom tray, or window ledges, without needing six separate purchases.<br><br>Their low price point also makes them a practical choice for party favours, festive gifting in bulk, or corporate giveaways where you need volume without a high per-unit cost.',

    burn_time:'1-2 hours per piece', size:'Set of 6, approx. 25g each', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:249, sale_price:100, badges:['Bundle Deal'],
    perfect_for: ['Decor', 'Small Gifts'],
    image:'assets/daisypetals.jpg',
    is_active:true, is_featured:true, sort_order:1 },

  { id:'lavender-gradient', name:'Lavender Gradient', type:'single', category:'jars',
    notes:'Jar Candle (190ml)', short_desc:'Beautifully layered lavender scent experience.', family: 'Floral',
    description:'Lavender Gradient is poured in soft, layered tones of purple that fade gently from deep to pale, mirroring the calming quality of the fragrance itself. It is one of our most requested candles for people building a wind-down evening routine.<br><br>The scent is a true, herbal lavender rather than a sweetened version, which tends to appeal to people who find fruity or sugary candles too heavy for bedtime use.<br><br>At 190ml, it is sized to sit comfortably on a nightstand and burn through a full evening without needing to be relit the next night, making it a practical everyday choice rather than an occasional-use piece.',

    burn_time:'20-24 hours', size:'190ml / approx. 175g', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:599, sale_price:399, badges:['Relaxing'],
    perfect_for: ['Bedroom', 'Sleep Ritual'],
    image:'assets/lavendergradient.jpg',
    is_active:true, is_featured:true, sort_order:11 },

  { id:'lavender-mist', name:'Lavender Mist', type:'single', category:'jars',
    notes:'Jar Candle (220ml)', short_desc:'A refreshing mist of pure lavender.', family: 'Floral',
    description:'Lavender Mist delivers a cleaner, lighter take on lavender compared to Lavender Gradient, with a slightly airier, "just-rained" quality to the fragrance. It is designed for people who want the calming benefits of lavender without a heavy, old-fashioned floral note.<br><br>At 220ml, it offers a slightly longer burn than our smaller jars, making it a good fit for spa-style evenings where you want the fragrance sustained over a longer bath or wind-down session.<br><br>Its refreshing character also makes it suitable for daytime use in home offices or meditation corners, not just as a strictly nighttime candle.',

    burn_time:'24-28 hours', size:'220ml / approx. 200g', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:699, sale_price:499, badges:['New'],
    perfect_for: ['Spa Day', 'Meditation'],
    image:'assets/lavendermist.jpg',
    is_active:true, is_featured:true, sort_order:4 },

  { id:'sky-teddy', name:'Sky Teddy', type:'single', category:'moulds',
    notes:'Mould Candle', short_desc:'Playful teddy sculpture in a serene sky hue.', family: 'Fresh',
    description:'Sky Teddy is a whimsical teddy-shaped mould candle finished in a soft, serene sky-blue hue, designed to feel calm rather than overtly playful despite its shape. It sits comfortably in both nursery decor and general home styling.<br><br>Its fragrance is light and fresh, with none of the heavy sweetness typical of "cute" novelty candles, which is part of what has made it popular with adult buyers as well as parents shopping for a baby\'s room.<br><br>Because of its soft form and gentle colour, it also photographs well for gifting occasions and is frequently bought as a baby shower or welcome-home gift.',

    burn_time:'14-18 hours', size:'Approx. 170g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:649, sale_price:449, badges:['New Arrival'],
    image:'assets/skyteddy.jpg',
    is_active:true, is_featured:true, sort_order:4 },

  { id:'heart-bloom', name:'Heart Bloom', type:'single', category:'moulds',
    notes:'Premium 8-inch Candle', short_desc:'Exquisite premium floral heart sculpture.', family: 'Floral',
    description:'Heart Bloom is our largest sculptural candle, standing at a full 8 inches and combining a heart silhouette with intricate layered floral detailing across its surface. It is positioned as a premium, statement gift rather than an everyday candle.<br><br>Its fragrance is a fuller, more complex floral blend designed to match its scale, opening bright and gradually deepening into a warmer, muskier base as it burns.<br><br>Given its size and finish, it is typically bought for milestone gifting occasions — engagements, anniversaries, or as a luxury self-purchase for someone who wants a genuine centerpiece candle rather than a small accent piece.',

    burn_time:'30-35 hours', size:'8 inches, approx. 400g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:1199, sale_price:899, badges:['Premium', 'Featured'],
    image:'assets/heartbloom.jpg',
    is_active:true, is_featured:true, sort_order:5 },

  { id:'pure-glow', name:'Pure Glow', type:'single', category:'jars',
    notes:'Jar Candle (350ml)', short_desc:'Minimalist elegance with a radiant burn.', family: 'Fresh',
    description:'Pure Glow is a minimalist 350ml jar candle built around a clean, fresh fragrance and an equally clean, unadorned jar design, for people who prefer their home fragrance understated rather than decorative.<br><br>The scent is designed to be neutral and inoffensive, working well in shared spaces like offices, waiting areas, or Airbnb-style rentals where you want a pleasant ambient smell without a strong personality.<br><br>Its long, even burn and radiant glow make it one of our most reliable "set it and forget it" candles, ideal for anyone who wants consistent performance over novelty.',

    burn_time:'35-40 hours', size:'350ml / approx. 320g', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:749, sale_price:549, badges:['New'],
    image:'assets/pureglow.jpg',
    is_active:true, is_featured:true, sort_order:19 },

  { id:'blush-serenity', name:'Blush Serenity', type:'single', category:'jars',
    notes:'Jar Candle (190ml)', short_desc:'A soft, calming fragrance experience.', family: 'Sweet',
    description:'Blush Serenity offers a soft, calming fragrance in a compact 190ml jar, sized deliberately for smaller spaces like study tables, vanity corners, or apartment bathrooms where a large jar would feel out of place.<br><br>Its scent profile is gentle and slightly sweet, closer to a soft powder than a dessert note, making it a good middle-ground option for people who want warmth without full-on sugary sweetness.<br><br>Because of its smaller size and gentler personality, it is a popular "everyday self-care" candle rather than an occasion piece, and pairs well as a bundled gift-with-purchase item.',

    burn_time:'18-22 hours', size:'190ml / approx. 175g', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:649, sale_price:449, badges:['New'],
    image:'assets/blushserenity.jpg',
    is_active:true, is_featured:true, sort_order:20 },

    { id:'rose-petals', name:'Rose Petals', type:'single', category:'moulds',
    notes:'Mould Candle', short_desc:'Delicate rose design for a romantic ambiance.', family: 'Floral',
    description:'Rose Petals is a small, delicate mould candle shaped like scattered rose petals, priced deliberately low so it can be added to gift boxes or bought in multiples without a big spend. It is one of our most accessible pieces.<br><br>Its fragrance is a light, true rose scent, subtle enough not to overpower a hamper filled with other scented items, which is exactly why it works well as an add-on gift rather than a standalone centerpiece.<br><br>Despite its small size and price, it retains the same hand-finished detailing as our larger rose pieces, just at a fraction of the burn time and cost.',

    burn_time:'4-5 hours', size:'Approx. 40g', wax:'Soy Pillar Wax', wick:'Cotton Braided Wick',
    original_price:149, sale_price:79, badges:['Romantic'],
    image:'assets/rosepetals.jpg',
    is_active:true, is_featured:true, sort_order:2 },

  { id:'darkcoffee', name:'Dark Coffee Ice Latte', type:'single', category:'jars',
    notes:'Jar Candle', short_desc:'Rich and robust coffee scent for a cozy atmosphere.', family: 'Sweet',
    description:'Dark Coffee Ice Latte fills a room with a rich, roasted coffee aroma modeled on the smell of a freshly brewed cafe latte, right down to a faint creamy top note. It has become one of our most requested candles for home offices and kitchens.<br><br>Unlike overly sweet dessert-style candles, this one leans savoury and slightly bitter at its base, which makes it appealing to customers who find vanilla or sugar-forward scents too much.<br><br>It performs particularly well as a morning candle, lit alongside your actual coffee, and is popular with customers who work from home and want a scent tied to focus and routine rather than relaxation.',

    burn_time:'28-32 hours', size:'Approx. 235ml', wax:'Soy Wax and Gel Wax', wick:'Cotton Braided Wick',
    original_price:699, sale_price:399, badges:['New'],
    image:'assets/darkcoffee.jpg',
    is_active:true, is_featured:true, sort_order:3 },

    { id:'blushingromance', name:'Blushing Romance', type:'single', category:'jars',
    notes:'Jar Candle', short_desc:'A delightful blend of floral and fruity notes.', family: 'Sweet',
    description:'Blushing Romance combines soft floral notes with a light fruity undertone, landing in a comfortable middle ground between our purely floral candles and our sweeter dessert-style ones. It is one of our more universally liked scents.<br><br>The blend was designed specifically to appeal to people who "don\'t usually like scented candles," softening typical floral sharpness with a rounder, fruitier finish.<br><br>Its versatile character makes it a safe gifting choice when you are unsure of someone\'s exact fragrance preference, and it performs consistently well across bedrooms, living rooms, and gifting occasions alike.',

    burn_time:'26-30 hours', size:'Approx. 220g', wax:'Soy Wax', wick:'Cotton Braided Wick',
    original_price:699, sale_price:399, badges:['New'],
    image:'assets/blushingromance.jpg',
    is_active:true, is_featured:true, sort_order:3 },


  { id:'matcha', name:'Matcha Ice Latte', type:'single', category:'jars',
    notes:'Jar Candle', short_desc:'Earthy and refreshing green tea scent.', family: 'Fresh',
    description:'Matcha Ice Latte brings an earthy, slightly grassy green tea fragrance to your home, modeled on the increasingly popular matcha latte rather than a generic "green tea" candle scent. It is distinct from anything else in our fresh fragrance family.<br><br>The scent profile is calming without being sleepy, and refreshing without being sharp or citrus-forward, which makes it a good fit for daytime use in a study or workspace.<br><br>It appeals particularly to customers who find our sweeter, dessert-inspired candles (like Strawberry Milk or Dark Coffee) too rich, offering a lighter, more earthy alternative in the same "drink-inspired" candle family.',

    burn_time:'26-30 hours', size:'Approx. 230ml', wax:'Soy Wax and Gel Wax', wick:'Cotton Braided Wick',
    original_price:699, sale_price:399, badges:['New'],
    image:'assets/match.jpg',
    is_active:true, is_featured:true, sort_order:4 }
];

const SCENT_OPTIONS = ['Lavender', 'Jasmine', 'Rose', 'Vanilla', 'Chocolate', 'Coffee', 'Sandalwood', 'Oud', 'Amber'];

const FALLBACK_VARIANTS = {
  'azure-bloom': [{id:'v1', variant_name:'Scented', sale_price:599, original_price:799, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:549, original_price:749}],

  'eternal-embrace': [{id:'v1', variant_name:'Scented', sale_price:399, original_price:499, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:299, original_price:399}],

  'ivory-rose': [{id:'v1', variant_name:'Scented', sale_price:349, original_price:499, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:299, original_price:399}],

  'rose-sculpture': [{id:'v1', variant_name:'Scented', sale_price:349, original_price:499, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:249, original_price:449}],

  'blue-blossom': [{id:'v1', variant_name:'Scented', sale_price:599, original_price:799, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:549, original_price:749}],

  'teddy-heart-jar': [{id:'v1', variant_name:'Scented', sale_price:549, original_price:799, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:499, original_price:699}],

  'wedding-couple': [{id:'v1', variant_name:'Scented', sale_price:399, original_price:599, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:299, original_price:499}],

  'daisy-bloom': [{id:'v1', variant_name:'Scented', sale_price:499, original_price:599, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:399, original_price:499}],

  'striped-candle': [{id:'v1', variant_name:'Scented', sale_price:499, original_price:699, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:449, original_price:649}],

  'teddy-bear': [{id:'v1', variant_name:'Scented', sale_price:199, original_price:299, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:149, original_price:249}],

  'z-shape': [{id:'v1', variant_name:'Scented', sale_price:299, original_price:499, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:249, original_price:449}],

  'daisypetals': [{id:'v1', variant_name:'Scented', sale_price:199, original_price:249, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:149, original_price:199}],

  'bubble-pack': [{id:'v1', variant_name:'Scented', sale_price:449, original_price:649, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:349, original_price:549}],

  'lavender-gradient': [{id:'v1', variant_name:'Scented', sale_price:399, original_price:599, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:349, original_price:549}],

  'lavender-mist': [{id:'v1', variant_name:'Scented', sale_price:499, original_price:699, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:449, original_price:649}],

  'coconut-blossom': [{id:'v1', variant_name:'Scented', sale_price:649, original_price:899, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:599, original_price:849}],

  'sky-teddy': [{id:'v1', variant_name:'Scented', sale_price:449, original_price:649, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:349, original_price:549}],

  'heart-bloom': [{id:'v1', variant_name:'Scented', sale_price:899, original_price:1199, is_default:true}],
  'pure-glow': [{id:'v1', variant_name:'Scented', sale_price:549, original_price:749, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:449, original_price:649}],

  'blush-serenity': [{id:'v1', variant_name:'Scented', sale_price:449, original_price:649, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:349, original_price:549}],

  'blushingromance': [{id:'v1', variant_name:'Scented', sale_price:349, original_price:449, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:299, original_price:399}],

  'rose-petals': [{id:'v1', variant_name:'Scented', sale_price:149, original_price:199, is_default:true}, {id:'v2', variant_name:'Non-Scented', sale_price:99, original_price:149}],

  'darkcoffee': [{id:'v1', variant_name:'Scented', sale_price:399, original_price:699, is_default:true}],
  'matcha': [{id:'v1', variant_name:'Scented', sale_price:399, original_price:699, is_default:true}],

  
};

/* ── ProductStore — single source of truth for the frontend ── */
const ProductStore = {
  products: [],
  variants:  {},   // { productId: [variant, ...] }
  loaded:    false,

  async load() {
    if (this.loaded) return;
    // Fallback
    this.products = FALLBACK_PRODUCTS;
    this.variants = FALLBACK_VARIANTS;
    this.loaded = true;
    
    // Display collection count at the top if element exists
    const countEl = document.getElementById('collection-count');
    if (countEl) {
      const total = this.getAll().length;
      const newArrivals = this.getNewArrivals().length;
      countEl.innerHTML = `
        <div style="font-size: 14px; letter-spacing: 0.1em; color: var(--gold); margin-bottom: 4px;">NEW ARRIVALS NOW LIVE</div>
        <div>${total} Candles in Collection | ${newArrivals} New Arrivals</div>
      `;
    }

    // Display detailed stats in the collection section
    const statsEl = document.getElementById('collection-stats');
    if (statsEl) {
      const all = this.getAll();
      const total = all.length;
      const jars = all.filter(p => p.category === 'jars').length;
      const moulds = all.filter(p => p.category === 'moulds').length;
      statsEl.textContent = `${total} Candles · ${jars} Artisan Jars · ${moulds} Sculptural Moulds`;
    }
  },

  getAll()        { return this.products.filter(p => p.is_active).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
  getFeatured()   { return this.products.filter(p => p.is_active && p.is_featured).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
  getBestsellers() { return this.products.filter(p => p.is_active && p.is_bestseller).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
  getNewArrivals(){ 
    return this.products.filter(p => {
      if (!p.is_active) return false;
      // Dynamically include anything with 'New' or 'New Arrival' in the badges
      const hasNewBadge = (p.badges || []).some(b => b.toLowerCase().includes('new'));
      return hasNewBadge;
    }).sort((a,b) => (b.sort_order || 0) - (a.sort_order || 0)).slice(0, 6); 
  },
  getSingles()    { return this.products.filter(p => p.is_active && p.type === 'single').sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
  getBundles()    { return this.products.filter(p => p.is_active && p.type === 'gift_set').sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)); },
  getById(id)     { return this.products.find(p => p.id === id && p.is_active) || null; },
  getRelated(id, limit = 4) {
    const current = this.getById(id);
    if (!current) return this.getFeatured().slice(0, limit);
    return this.products
      .filter(p => p.is_active && p.id !== id && (p.category === current.category || p.family === current.family))
      .slice(0, limit);
  },
  getVariants(id) { return (this.variants[id] || []).sort((a,b) => a.sort_order - b.sort_order); },
  getDefaultVariant(id) {
    const vars = this.getVariants(id);
    // Display non-scented prices by default on cards as requested
    const nsVariant = vars.find(v => v.variant_name.toLowerCase().includes('non-scented'));
    if (nsVariant) return nsVariant;
    
    return vars.find(v => v.is_default) || vars[0] || null;
  },

  /* Convenience: price display for a product (uses default variant) */
  getDisplayPrice(product) {
    const defVar = this.getDefaultVariant(product.id);
    if (defVar) return { sale: defVar.sale_price, original: defVar.original_price };
    return { sale: product.sale_price, original: product.original_price };
  }
};

/* ── Render: Product Card ────────────────────────────────── */
function renderProductCard(product, index = 0) {
  const price   = ProductStore.getDisplayPrice(product);
  const savings = price.original - price.sale;
  const pct     = Math.round((savings / price.original) * 100);
  const badges  = (product.badges || []).map(b =>
    `<span class="badge badge-${b.toLowerCase().replace(/\s+/g,'-')}">${b}</span>`
  ).join('');
  const hasVariants = (ProductStore.getVariants(product.id) || []).length > 1;
  const varLabel = hasVariants ? '<span style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-left:6px">+ Options</span>' : '';

  // Detect if we are in a subfolder (like /pages/) to fix image path
  const isSubPage = window.location.pathname.includes('/pages/');
  const imagePath = isSubPage ? '../' + product.image : product.image;

  return `
    <article class="product-card reveal reveal-delay-${(index % 4) + 1}"
      data-product-id="${product.id}"
      style="cursor:pointer"
      onclick="if(!event.target.closest('button')) { 
        const url = window.location.pathname.includes('/pages/') ? 'product.html' : 'pages/product.html';
        window.location.href = url + '?id=${product.id}';
      }">
      <div class="product-image-wrap">
        <img src="${imagePath}" alt="${product.name}" loading="lazy"
          onerror="this.src='${isSubPage ? '../' : ''}assets/strawberrymilk.jpg'">
        <div class="product-badge">${badges}</div>
        ${product.type !== 'single' ? '' : `
        <div class="product-quick-add">
          <button class="btn btn-primary btn-sm btn-full"
            onclick="event.stopPropagation();ProductStore.quickAdd('${product.id}', event)">
            <span>Add to Inquiry</span>
          </button>
        </div>`}
      </div>
      <div class="product-body">
        <h3 class="product-name">${product.name}${varLabel}</h3>
        <p class="product-notes">${product.notes || ''}</p>
        <div class="product-meta">
          <span class="price-sale">₹${price.sale.toLocaleString('en-IN')}</span>
          ${price.original > price.sale ? `<span class="price-original">₹${price.original.toLocaleString('en-IN')}</span>` : ''}
          ${pct > 0 ? `<span class="price-savings">Save ${pct}%</span>` : ''}
        </div>
      </div>
    </article>`;
}

/* Quick add — Redirects to product page to ensure customization lock workflow */
ProductStore.quickAdd = function(productId) {
  const product = this.getById(productId);
  if (!product) return;
  const isSubPage = window.location.pathname.includes('/pages/');
  const url = isSubPage ? 'product.html' : 'pages/product.html';
  window.location.href = `${url}?id=${product.id}`;
};

/* ── Variant Selector UI (used on product detail page) ────── */
function renderVariantSelector(product, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const variants = ProductStore.getVariants(product.id);
  
  // If no variants, just show the base price and add to cart logic
  if (!variants || variants.length === 0) {
    _renderBaseProduct(product, container);
    return;
  }

  let selectedId = ProductStore.getDefaultVariant(product.id)?.id;
  let selectedScent = "";

  function render() {
    const sel = variants.find(v => v.id === selectedId) || variants[0];
    const isScented = sel.variant_name.toLowerCase().includes('scented') && !sel.variant_name.toLowerCase().includes('non-scented');

    let scentHtml = '';
    if (isScented) {
      scentHtml = `
        <div style="margin-top:20px; margin-bottom: 24px;">
          <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:12px">
            Choose Fragrance
          </p>
          <select id="scent-choice" class="form-control" style="width:100%" onchange="window.updateScentChoice(this.value)">
            <option value="" disabled ${!selectedScent ? 'selected' : ''}>-- Select Fragrance --</option>
            ${SCENT_OPTIONS.map(s => `<option value="${s}" ${selectedScent === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="margin-bottom:24px">
        <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:14px">
          Select Option
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:8px" role="radiogroup" aria-label="Product variants">
          ${variants.map(v => `
            <button
              role="radio"
              aria-checked="${v.id === selectedId}"
              onclick="selectVariant('${v.id}')"
              style="
                padding:10px 16px;font-size:11px;letter-spacing:0.08em;
                border:1px solid ${v.id === selectedId ? 'var(--espresso)' : 'var(--border-dark)'};
                background:${v.id === selectedId ? 'var(--espresso)' : 'transparent'};
                color:${v.id === selectedId ? 'var(--ivory)' : 'var(--charcoal)'};
                cursor:pointer;transition:all 0.2s;font-family:var(--font-sans);
                display:flex;flex-direction:column;align-items:flex-start;gap:2px;
              ">
              <span>${v.variant_name}</span>
              <span style="font-size:10px;opacity:0.7">₹${v.sale_price.toLocaleString('en-IN')}</span>
            </button>`).join('')}
        </div>
        ${scentHtml}
      </div>`;

    // Update page price display
    if (sel) {
      const salePriceEl = document.getElementById('product-price-sale');
      const origPriceEl = document.getElementById('product-price-orig');
      const savingsEl = document.getElementById('product-price-savings');

      if (salePriceEl) salePriceEl.textContent = `₹${sel.sale_price.toLocaleString('en-IN')}`;
      if (origPriceEl) origPriceEl.textContent  = sel.original_price > sel.sale_price
        ? `₹${sel.original_price.toLocaleString('en-IN')}` : '';

      if (savingsEl) {
        const savings = sel.original_price - sel.sale_price;
        const pct = savings > 0 ? Math.round((savings / sel.original_price) * 100) : 0;
        savingsEl.textContent = pct > 0 ? `Save ${pct}%` : '';
      }

      // Update Add to Cart button
      const addBtn = document.getElementById('add-to-cart-btn');
      if (addBtn) {
        addBtn.onclick = () => {
          if (isScented && !selectedScent) {
            if (typeof toast === 'function') toast('Please select a fragrance first', 'error');
            else alert('Please select a fragrance first');
            return;
          }

          Cart.add({
            id:            `${product.id}__${sel.id}${isScented ? '__' + selectedScent.toLowerCase().replace(/\s+/g, '-') : ''}`,
            name:          product.name,
            notes:         isScented ? `${sel.variant_name} (${selectedScent})` : sel.variant_name,
            price:         sel.sale_price,
            originalPrice: sel.original_price,
            image:         product.image || '',
            variantId:     sel.id
          });
        };
        addBtn.querySelector('span').textContent = `Add to Cart — ₹${sel.sale_price.toLocaleString('en-IN')}`;
      }
      if (addBtn && !addBtn.closest('.product-actions').querySelector('.product-offer-hint')) {
        const hint = document.createElement('div');
        hint.className = 'product-offer-hint';
        hint.innerHTML = '✨ Buy 2 & Save 10% • Buy 4 & Save 15% <br> <span style="font-size: 0.95em; opacity: 0.8;">Free Shipping on orders above ₹1,999</span>';
        addBtn.parentNode.appendChild(hint);
      }
    }
  }

  window.selectVariant = function(id) {
    selectedId = id;
    selectedScent = ""; // Reset scent when variant changes
    render();
  };

  window.updateScentChoice = function(val) {
    selectedScent = val;
    render();
  }

  render();
}

function _renderBaseProduct(product, container) {
  container.innerHTML = '';
    
  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      Cart.add({
        id: product.id,
        name: product.name,
        notes: product.notes || '',
        price: product.sale_price,
        image: product.image
      });
    };
  }
}

/* Backwards-compat: PRODUCTS array (legacy reference) */
let PRODUCTS = FALLBACK_PRODUCTS;
ProductStore.load().then(() => { PRODUCTS = ProductStore.products; }).catch(() => {});