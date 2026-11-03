import json

DISEASES_55 = [
  # Cashew
  {
    "id": "cashew-leaf-miner",
    "crop": "Cashew",
    "name": "Leaf Miner",
    "pathogen": "Acrocercops syngramma (Insect pest)",
    "type": "Pest",
    "severity": "Moderate",
    "summary": "Larvae mine blister-like silvery patches on tender leaves that dry and turn necrotic.",
    "symptoms": ["Silvery serpentine trails on young foliage", "Blister-like swelling on leaf lamina", "Dry, ragged holes on mature leaves"],
    "management": ["Spray Lambda-cyhalothrin 5% EC (0.6 ml/L)", "Prune heavily infested tender shoots"],
    "prevention": ["Synchronize new flush management", "Conserve natural braconid parasitoids"]
  },
  {
    "id": "cashew-red-rust",
    "crop": "Cashew",
    "name": "Red Rust",
    "pathogen": "Cephaleuros virescens (Parasitic green alga)",
    "type": "Algal",
    "severity": "Moderate",
    "summary": "Velvety orange-red circular spots on leaves and twigs during warm humid seasons.",
    "symptoms": ["Velvety reddish-brown circular patches on upper leaf surface", "Premature leaf shedding in severe infections", "Bark cracking on young twigs"],
    "management": ["Spray Copper Oxychloride 50% WP (2.5 g/L)", "Ensure canopy aeration through pruning"],
    "prevention": ["Improve soil drainage and organic matter", "Avoid excessive tree crowding"]
  },
  {
    "id": "cashew-healthy",
    "crop": "Cashew",
    "name": "Healthy Cashew",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Cashew canopy is vigorous, shiny, deep green, and free from leaf miners or algal rust.",
    "symptoms": ["Thick, shiny leathery green leaves", "Clean terminal shoots", "Uniform vegetative flush"],
    "management": ["Apply balanced N-P-K (500:250:250 g/tree)", "Provide basin irrigation during flowering"],
    "prevention": ["Routine sanitation and weeding around root basins"]
  },

  # Cassava
  {
    "id": "cassava-brown-spot",
    "crop": "Cassava",
    "name": "Brown Streak / Spot",
    "pathogen": "Passalora henningsii (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Small uniform brown circular lesions with distinct dark borders on mature lower leaves.",
    "symptoms": ["Circular brown spots with darker borders", "Yellow halos around expanding lesions", "Premature defoliation of lower canopy"],
    "management": ["Spray Mancozeb 75% WP (2 g/L)", "Remove heavily diseased fallen leaves"],
    "prevention": ["Plant tolerant cassava varieties", "Adopt 2-year crop rotation"]
  },
  {
    "id": "cassava-mosaic",
    "crop": "Cassava",
    "name": "Cassava Mosaic Disease (CMD)",
    "pathogen": "African Cassava Mosaic Virus (ACMV / Begomovirus)",
    "type": "Viral",
    "severity": "High",
    "summary": "Devastating viral disease causing puckering, leaf distortion, and chlorotic mosaic patches.",
    "symptoms": ["Variegated light green and yellow mosaic patterns", "Severe distortion, twisting, and reduction of leaf blades", "Stunted plant growth and reduced tuber yield"],
    "management": ["Rogue out and destroy infected stems immediately", "Spray Imidacloprid (0.3 ml/L) to control whitefly vectors"],
    "prevention": ["Use certified virus-free stem cuttings", "Plant CMD-resistant cultivars"]
  },
  {
    "id": "cassava-healthy",
    "crop": "Cassava",
    "name": "Healthy Cassava",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Foliage shows vibrant palmate green leaves without distortion or chlorotic patches.",
    "symptoms": ["Symmetric palmate leaflets", "Uniform green lamina with sturdy petioles", "Vigorous stem elongation"],
    "management": ["Ensure adequate soil potassium for root bulking", "Weed regularly in first 3 months"],
    "prevention": ["Source certified healthy planting stakes"]
  },

  # Chilli
  {
    "id": "chilli-white-spot",
    "crop": "Chilli",
    "name": "White Spot / Frogeye Leaf Spot",
    "pathogen": "Cercospora capsici (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Circular spots with whitish-grey centers and distinct dark red-brown margins.",
    "symptoms": ["Frogeye circular spots with whitish bleached centers", "Dark reddish-brown halos", "Severe leaf drop exposing fruit to sunscald"],
    "management": ["Spray Carbendazim 50% WP (1 g/L) or Difenoconazole (0.5 ml/L)", "Avoid overhead irrigation"],
    "prevention": ["Crop rotation away from solanaceous plants for 2 years", "Use certified disease-free seeds"]
  },
  {
    "id": "chilli-nutrient-deficiency",
    "crop": "Chilli",
    "name": "Nutrient Deficiency (N-P-K/Mg)",
    "pathogen": "Physiological / Soil Nutrient Imbalance",
    "type": "Nutritional",
    "severity": "Moderate",
    "summary": "Interveinal yellowing, chlorosis, and purpling due to deficient macro/micro nutrients.",
    "symptoms": ["Interveinal chlorosis on older leaves (Mg deficiency)", "Uniform pale light green leaf color (Nitrogen deficit)", "Purple tint on leaf underside (Phosphorus deficiency)"],
    "management": ["Apply 19-19-19 water soluble fertilizer spray (5 g/L)", "Drench with Magnesium Sulphate (5 g/L)"],
    "prevention": ["Conduct periodic soil health testing", "Incorporate well-rotted farmyard manure"]
  },
  {
    "id": "chilli-healthy",
    "crop": "Chilli",
    "name": "Healthy Chilli",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Chilli canopy is lush green, sturdy, upright, and free from pests or spots.",
    "symptoms": ["Firm dark green leaves", "Clean branching with healthy floral buds", "No puckering or stippling"],
    "management": ["Maintain steady drip irrigation", "Balanced N-P-K fertigation"],
    "prevention": ["Preventive neem oil spray (1500 ppm) every 14 days"]
  },

  # Citrus
  {
    "id": "citrus-black-spot",
    "crop": "Citrus",
    "name": "Black Spot",
    "pathogen": "Phyllosticta citricarpa (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Small sunken dark brown circular spots with raised black borders on leaves and rind.",
    "symptoms": ["Circular sunken spots with reddish-black margins", "Tiny black pycnidia pimples inside lesions", "Premature leaf fall and fruit blemishes"],
    "management": ["Spray Copper Oxychloride (2.5 g/L) or Azoxystrobin (1 ml/L)", "Prune dead twig wood"],
    "prevention": ["Rake and destroy fallen leaf litter", "Provide drip irrigation to keep canopy dry"]
  },
  {
    "id": "citrus-canker",
    "crop": "Citrus",
    "name": "Citrus Canker",
    "pathogen": "Xanthomonas axonopodis pv. citri (Bacterium)",
    "type": "Bacterial",
    "severity": "High",
    "summary": "Raised corky blister-like lesions surrounded by distinct oily yellow halos.",
    "symptoms": ["Corky raised pustules on both upper and lower leaf surfaces", "Characteristic oily yellow halo ring", "Stem and twig cankers causing dieback"],
    "management": ["Spray Streptocycline (100 ppm, 1 g/10 L) + Copper Oxychloride (2.5 g/L)", "Prune infected twigs before monsoon"],
    "prevention": ["Plant canker-resistant citrus rootstocks", "Erect windbreaks around orchard borders"]
  },
  {
    "id": "citrus-healthy",
    "crop": "Citrus",
    "name": "Healthy Citrus",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Glossy dark green citrus foliage with firm petiole wings and healthy flush.",
    "symptoms": ["Uniform dark green glossy leaves", "No pustules, leaf miners, or yellowing", "Strong stem tissue"],
    "management": ["Apply micronutrient foliar spray (Zn, Fe, Mn) twice a year", "Maintain regular irrigation"],
    "prevention": ["Monitor orchard borders for citrus psyllid vectors"]
  },

  # Cotton
  {
    "id": "cotton-bacterial-blight",
    "crop": "Cotton",
    "name": "Bacterial Blight / Angular Leaf Spot",
    "pathogen": "Xanthomonas citri pv. malvacearum",
    "type": "Bacterial",
    "severity": "High",
    "summary": "Water-soaked angular leaf spots bounded by veinlets that turn dark brown to black.",
    "symptoms": ["Small angular water-soaked lesions restricted by veins", "Blackarm phase causing dark girdling of branches", "Boll rot with sunken black spots"],
    "management": ["Spray Copper Oxychloride (2.5 g/L) + Streptocycline (1 g/10 L)", "Rogue severely affected plants"],
    "prevention": ["Acid-delint certified seed before sowing", "Avoid flood irrigation during humid weather"]
  },
  {
    "id": "cotton-curl-virus",
    "crop": "Cotton",
    "name": "Cotton Leaf Curl Virus (CLCuV)",
    "pathogen": "Begomovirus transmitted by Whiteflies",
    "type": "Viral",
    "severity": "High",
    "summary": "Upward or downward leaf curling, vein thickening, and enation cup-like growths.",
    "symptoms": ["Thickened green primary and secondary veins", "Severe upward curling of leaves", "Leaf-like outgrowths (enations) under leaves"],
    "management": ["Spray Diafenthiuron (1 g/L) or Spiromesifen to control whitefly vector", "Uproot virus-infected plants"],
    "prevention": ["Sow CLCuV-resistant Bt-cotton hybrids", "Maintain border weed control"]
  },
  {
    "id": "cotton-healthy",
    "crop": "Cotton",
    "name": "Healthy Cotton",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Robust lobed cotton foliage with strong squaring and no pest puncture damage.",
    "symptoms": ["Broad, healthy lobed leaves", "Clean petioles and vigorous terminal growth", "Sturdy square/boll formation"],
    "management": ["Apply balanced N-P-K with split nitrogen doses", "Monitor with pheromone traps"],
    "prevention": ["Maintain optimal plant-to-plant spacing for aeration"]
  },

  # Corn (Maize)
  {
    "id": "corn-leaf-spot",
    "crop": "Corn (Maize)",
    "name": "Gray Leaf Spot",
    "pathogen": "Cercospora zeae-maydis (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Rectangular tan to gray lesions that expand parallel to leaf veins.",
    "symptoms": ["Narrow rectangular lesions bounded by parallel veins", "Lesions coalesce to cause extensive leaf blight", "Premature drying of canopy"],
    "management": ["Apply Azoxystrobin + Difenoconazole (1 ml/L)", "Deep plow crop residues"],
    "prevention": ["Rotate with non-host crops like soybean or pulses", "Plant resistant corn hybrids"]
  },
  {
    "id": "corn-streak-virus",
    "crop": "Corn (Maize)",
    "name": "Maize Streak Virus (MSV)",
    "pathogen": "Mastrevirus transmitted by Leafhoppers (Cicadulina)",
    "type": "Viral",
    "severity": "High",
    "summary": "Continuous chlorotic streaks parallel to veins causing severe plant stunting.",
    "symptoms": ["Small round scattered chlorotic spots on young leaves", "Spots coalesce into continuous yellow-white longitudinal streaks", "Severe stunting and barren cobs"],
    "management": ["Control vector leafhoppers with Imidacloprid (0.5 ml/L)", "Remove infected plants early"],
    "prevention": ["Plant MSV-resistant hybrid maize", "Avoid planting near older grassy weeds"]
  },
  {
    "id": "corn-healthy",
    "crop": "Corn (Maize)",
    "name": "Healthy Corn (Maize)",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Broad, vibrant green arching maize leaves with robust venation and strong stalk.",
    "symptoms": ["Uniformly dark green arching leaves", "Sturdy thick stalks with healthy brace roots", "Clean silks and tassels"],
    "management": ["Apply top-dressed Urea at knee-high and tasseling stages", "Maintain adequate root moisture"],
    "prevention": ["Preventive field scouting for armyworm and rust"]
  },

  # Grape
  {
    "id": "grape-black-rot",
    "crop": "Grape",
    "name": "Black Rot",
    "pathogen": "Guignardia bidwellii (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Small reddish-brown circular spots with dark borders that cause berries to shrivel into mummies.",
    "symptoms": ["Circular reddish-brown spots with dark borders", "Tiny black pycnidia inside lesions", "Berries turn brown, rot, and shrivel into black mummies"],
    "management": ["Spray Mancozeb (2 g/L) or Myclobutanil (0.5 g/L)", "Remove mummified berries from vine"],
    "prevention": ["Canopy management for air circulation and sunlight", "Prune dead vine wood"]
  },
  {
    "id": "grape-leaf-blight",
    "crop": "Grape",
    "name": "Leaf Blight (Isariopsis)",
    "pathogen": "Pseudocercospora vitis (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Irregular dark brown patches on mature leaves leading to defoliation.",
    "symptoms": ["Irregular dark brown to black necrotic spots", "Concentric rings on older lesions", "Premature leaf drop reducing grape sweetness"],
    "management": ["Apply Chlorothalonil 75% WP (2 g/L) or Copper Hydroxide", "Burn pruned infected leaves"],
    "prevention": ["Ensure adequate vine trellising and sunlight", "Avoid excessive nitrogen fertilization"]
  },
  {
    "id": "grape-healthy",
    "crop": "Grape",
    "name": "Healthy Grape",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Vibrant palmate grape leaves with clean venation and vigorous tendril growth.",
    "symptoms": ["Deep green lobed leaves", "Clean clusters with bloom", "Firm vine wood without lesions"],
    "management": ["Maintain drip fertigation and shoot thinning", "Regulate cluster load"],
    "prevention": ["Preventive sulfur dust application during spring"]
  },

  # Groundnut
  {
    "id": "groundnut-late-leaf-spot",
    "crop": "Groundnut",
    "name": "Late Leaf Spot (Tikka)",
    "pathogen": "Phaeoisariopsis personata (Fungus)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Small circular almost black spots on lower leaf surface with carbonaceous pustules.",
    "symptoms": ["Small dark brown to black circular lesions on lower leaf surfaces", "No distinct yellow halo", "Severe defoliation leading to peg collapse"],
    "management": ["Spray Tebuconazole 25.9% EC (1 ml/L) or Mancozeb (2.5 g/L)", "Spray at 15-day intervals during humid periods"],
    "prevention": ["Follow 2-year crop rotation with millets/cereals", "Seed treatment with Trichoderma viride (10 g/kg)"]
  },
  {
    "id": "groundnut-nutrient-deficiency",
    "crop": "Groundnut",
    "name": "Nutrient Deficiency (Fe / Zn / Ca)",
    "pathogen": "Physiological / Soil Mineral Imbalance",
    "type": "Nutritional",
    "severity": "Moderate",
    "summary": "Interveinal yellowing (Iron chlorosis) and poor pod filling due to calcium deficit.",
    "symptoms": ["Young emerging leaves turn ivory white or pale yellow", "Reduced leaflet size and stunting", "Pops (empty pods) due to calcium deficiency"],
    "management": ["Spray Ferrous Sulphate (5 g/L) + Citric Acid (1 g/L)", "Apply Gypsum at pegging stage (200 kg/acre)"],
    "prevention": ["Maintain soil pH between 6.0 and 7.5", "Incorporate organic compost into sandy soils"]
  },
  {
    "id": "groundnut-healthy",
    "crop": "Groundnut",
    "name": "Healthy Groundnut",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Vigorous quadrifoliolate green groundnut leaves with strong peg penetration.",
    "symptoms": ["Uniform green four-leaflet foliage", "Sturdy branching with abundant yellow flowers", "Healthy peg formation"],
    "management": ["Ensure earthing up at pegging stage", "Provide light irrigation during pod development"],
    "prevention": ["Use certified disease-free seed kernels"]
  },

  # Papaya
  {
    "id": "papaya-bacterial-spot",
    "crop": "Papaya",
    "name": "Bacterial Canker / Spot",
    "pathogen": "Erwinia papayae (Bacterium)",
    "type": "Bacterial",
    "severity": "High",
    "summary": "Water-soaked translucent spots on leaves and petioles that rapidly turn brown.",
    "symptoms": ["Water-soaked angular spots on young foliage", "Stem and petiole collapse with water-soaked rot", "Foul-smelling bacterial exudate"],
    "management": ["Spray Copper Oxychloride (2.5 g/L) + Kasugamycin (1.5 ml/L)", "Prune and burn infected plant parts"],
    "prevention": ["Ensure excellent soil drainage", "Avoid tree wounding during weeding"]
  },
  {
    "id": "papaya-ring-spot",
    "crop": "Papaya",
    "name": "Papaya Ring Spot Virus (PRSV)",
    "pathogen": "Potyvirus transmitted by Aphids",
    "type": "Viral",
    "severity": "High",
    "summary": "Severe mosaic, shoe-string leaf distortion, and oily green rings on stems and fruit.",
    "symptoms": ["Yellow mosaic and blistering on leaves", "Severe leaf reduction to veins (shoe-string symptom)", "Concentric oily ring marks on fruit and stems"],
    "management": ["Spray Imidacloprid (0.3 ml/L) to control aphid vector", "Rogue out infected papaya trees promptly"],
    "prevention": ["Plant PRSV-tolerant papaya hybrids (e.g., Red Lady 786)", "Erect maize/sorghum barrier crops"]
  },
  {
    "id": "papaya-healthy",
    "crop": "Papaya",
    "name": "Healthy Papaya",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Large, healthy palmate papaya leaves with strong central trunk and prolific fruiting.",
    "symptoms": ["Large palmately lobed green leaves", "Firm hollow petioles without spots", "Vigorous trunk with healthy fruit clusters"],
    "management": ["Apply 250 g N, 250 g P, 500 g K per plant annually", "Drench with Trichoderma around base"],
    "prevention": ["Scout regularly for aphid colonies on leaf undersides"]
  },

  # Potato
  {
    "id": "potato-early-blight",
    "crop": "Potato",
    "name": "Early Blight",
    "pathogen": "Alternaria solani (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Target-board concentric rings on older lower leaves spreading upward in warm weather.",
    "symptoms": ["Dark brown circular spots with concentric rings", "Yellow chlorotic halos surrounding lesions", "Premature defoliation"],
    "management": ["Spray Mancozeb 75% WP (2.5 g/L) or Chlorothalonil", "Apply at 7–10 day intervals during humid weather"],
    "prevention": ["Plant certified disease-free seed tubers", "Maintain 3-year crop rotation"]
  },
  {
    "id": "potato-late-blight",
    "crop": "Potato",
    "name": "Late Blight",
    "pathogen": "Phytophthora infestans (Oomycete)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Devastating water-soaked lesions with white mold on leaf undersides in cool humid weather.",
    "symptoms": ["Irregular pale-green to brown water-soaked lesions", "White downy mildew on underside in morning humidity", "Rapid stem collapse and tuber rot"],
    "management": ["Spray Metalaxyl + Mancozeb (2.5 g/L) or Cymoxanil immediately", "Cut haulms before harvest to protect tubers"],
    "prevention": ["Plant late-blight resistant potato varieties (Kufri Girdhari)", "Avoid overhead irrigation"]
  },
  {
    "id": "potato-healthy",
    "crop": "Potato",
    "name": "Healthy Potato",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Compound green potato foliage is vibrant, robust, and free from blight or mosaic.",
    "symptoms": ["Smooth green compound foliage", "Clean stems and sturdy petioles", "Vigorous photosynthetic activity"],
    "management": ["Earthing up at 30 days after planting", "Balanced N-P-K fertilization"],
    "prevention": ["Preventive spray of Mancozeb during cloudy spells"]
  },

  # Pepper (Bell)
  {
    "id": "pepper-bacterial-spot",
    "crop": "Pepper (Bell)",
    "name": "Bacterial Spot",
    "pathogen": "Xanthomonas campestris pv. vesicatoria",
    "type": "Bacterial",
    "severity": "Moderate",
    "summary": "Small water-soaked blister spots that turn dark brown with yellow halos.",
    "symptoms": ["Small dark brown angular spots on leaves", "Severe leaf drop exposing fruit to sunscald", "Raised scab-like spots on peppers"],
    "management": ["Spray Copper Oxychloride (2.5 g/L) + Mancozeb (2 g/L)", "Remove heavily diseased foliage"],
    "prevention": ["Use certified disease-free seeds", "Rotate crops away from solanaceous plants"]
  },
  {
    "id": "pepper-healthy",
    "crop": "Pepper (Bell)",
    "name": "Healthy Pepper (Bell)",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Lush dark green bell pepper foliage with healthy flowering nodes and fruit set.",
    "symptoms": ["Uniform green leaf lamina without lesions", "Normal upright growth habit", "Clean buds and flowers"],
    "management": ["Balanced N-P-K fertigation and consistent moisture", "Stake plants for support"],
    "prevention": ["Preventive neem oil spray (1500 ppm) for thrips control"]
  },

  # Rice
  {
    "id": "rice-brown-spot",
    "crop": "Rice",
    "name": "Brown Spot",
    "pathogen": "Bipolaris oryzae (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Oval to circular brown spots with yellow halos resembling sesame seeds.",
    "symptoms": ["Small oval dark brown spots with yellow halos", "Spots coalesce causing complete leaf blighting", "Discoloration and poor filling of grains"],
    "management": ["Spray Mancozeb (2.5 g/L) or Propiconazole 25% EC (1 ml/L)", "Apply balanced nitrogen; avoid deficit"],
    "prevention": ["Seed treatment with Carbendazim (2 g/kg seed)", "Ensure adequate soil potassium and silicon"]
  },
  {
    "id": "rice-leaf-blast",
    "crop": "Rice",
    "name": "Leaf Blast",
    "pathogen": "Magnaporthe oryzae (Pyricularia oryzae)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Spindle-shaped elliptical lesions with gray-white centers and brownish margins.",
    "symptoms": ["Spindle-shaped diamond lesions with pointed ends", "Grayish white centers and brown-red borders", "Complete burning of entire paddy fields under heavy humidity"],
    "management": ["Spray Tricyclazole 75% WP (0.6 g/L) or Isoprothiolane (1.5 ml/L)", "Drain field temporarily if excess nitrogen applied"],
    "prevention": ["Use blast-resistant varieties", "Apply nitrogen in 3–4 split doses"]
  },
  {
    "id": "rice-healthy",
    "crop": "Rice",
    "name": "Healthy Rice",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Vibrant upright linear paddy leaves with vigorous tillering and healthy panicles.",
    "symptoms": ["Clean green linear leaves without spots", "Strong tillering from base", "Clean sheath and panicle emergence"],
    "management": ["Maintain standing water (2–5 cm) during vegetative stage", "Apply recommended N-P-K (120:60:60 kg/ha)"],
    "prevention": ["Seed soaking with bio-fungicides before nursery sowing"]
  },

  # Soybean
  {
    "id": "soybean-caterpillar",
    "crop": "Soybean",
    "name": "Caterpillar / Semilooper Damage",
    "pathogen": "Chrysodeixis acuta / Spodoptera litura (Pest)",
    "type": "Pest",
    "severity": "Moderate",
    "summary": "Extensive foliar defoliation, skeletonization, and holes caused by voracious feeding.",
    "symptoms": ["Irregular holes chewed out of leaf lamina", "Skeletonized leaves with only veins remaining", "Fecal frass pellets visible on leaves"],
    "management": ["Spray Chlorantraniliprole 18.5% SC (0.3 ml/L) or Emamectin Benzoate (0.4 g/L)", "Install pheromone traps (5/acre)"],
    "prevention": ["Conserve natural predators like spiders and ladybugs", "Spray Bacillus thuringiensis (Bt) early"]
  },
  {
    "id": "soybean-diabrotica",
    "crop": "Soybean",
    "name": "Diabrotica / Leaf Beetle Damage",
    "pathogen": "Diabrotica speciosa / Chrysomelidae (Pest)",
    "type": "Pest",
    "severity": "Moderate",
    "summary": "Pinhole perforations and shot-hole leaf damage caused by adult leaf beetles.",
    "symptoms": ["Circular shot-holes across leaf lamina", "Yellowing and ragged leaf margins", "Reduced photosynthetic surface area"],
    "management": ["Spray Thiamethoxam 25% WG (0.3 g/L) or Lambda-cyhalothrin", "Spray during early morning when beetles are active"],
    "prevention": ["Early sowing to escape peak beetle population", "Crop rotation with non-host grasses"]
  },
  {
    "id": "soybean-healthy",
    "crop": "Soybean",
    "name": "Healthy Soybean",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Trifoliolate green soybean canopy with dense node development and healthy pods.",
    "symptoms": ["Broad, clean trifoliolate green leaves", "Strong branching and nodulation", "Clean pod formation at leaf axils"],
    "management": ["Inoculate seeds with Bradyrhizobium culture", "Maintain moisture during flowering"],
    "prevention": ["Keep borders free of broadleaf weeds"]
  },

  # Sugarcane
  {
    "id": "sugarcane-brown-spot",
    "crop": "Sugarcane",
    "name": "Brown Spot",
    "pathogen": "Cercospora longipes (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Reddish-brown narrow oval lesions that expand along sugarcane leaf blades.",
    "symptoms": ["Small reddish-brown spots visible on both leaf surfaces", "Yellow halos around expanding lesions", "Premature drying of leaf canopy"],
    "management": ["Spray Mancozeb (2.5 g/L) or Carbendazim (1 g/L)", "Strip off heavily infected lower dry leaves (detrashing)"],
    "prevention": ["Plant resistant sugarcane varieties (e.g., Co 86032)", "Ensure proper drainage in furrow beds"]
  },
  {
    "id": "sugarcane-grassy-shoot",
    "crop": "Sugarcane",
    "name": "Grassy Shoot Disease (GSD)",
    "pathogen": "Phytoplasma transmitted by Aphids (Melanaphis sacchari)",
    "type": "Bacterial",
    "severity": "High",
    "summary": "Profuse thin, stunted tillers with narrow chlorotic leaves resembling turf grass.",
    "symptoms": ["Prolific production of thin, slender tillers from stool base", "Narrow, pale yellow to papery white leaves", "Total absence of millable cane stalks"],
    "management": ["Uproot and burn infected grassy shoot clumps immediately", "Spray Dimethoate (1.7 ml/L) to control aphid vectors"],
    "prevention": ["Hot water treatment of setts (50°C for 2 hours) before planting", "Use tissue-cultured planting setts"]
  },
  {
    "id": "sugarcane-healthy",
    "crop": "Sugarcane",
    "name": "Healthy Sugarcane",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Broad, vigorous arching sugarcane foliage with thick, sturdy sucrose-rich stalks.",
    "symptoms": ["Long, dark green arching leaf blades with serrated edges", "Thick, clean internodes without borer holes", "Vigorous stool canopy"],
    "management": ["Apply N-P-K (250:100:120 kg/ha) with split nitrogen", "Trash mulching between cane rows"],
    "prevention": ["Detrash dry lower leaves at 5th and 7th month for aeration"]
  },

  # Tomato
  {
    "id": "tomato-bacterial-spot",
    "crop": "Tomato",
    "name": "Bacterial Spot",
    "pathogen": "Xanthomonas campestris pv. vesicatoria",
    "type": "Bacterial",
    "severity": "Moderate",
    "summary": "Small dark water-soaked spots with yellow halos that turn into scab lesions.",
    "symptoms": ["Small circular dark lesions on foliage", "Premature yellowing and leaf loss", "Raised black scabs on green tomatoes"],
    "management": ["Spray Copper Hydroxide (2.5 g/L) + Mancozeb (2 g/L)", "Sterilize trellising tools"],
    "prevention": ["Use certified disease-free hybrid seeds", "Mulch with straw to avoid soil spore splash"]
  },
  {
    "id": "tomato-early-blight",
    "crop": "Tomato",
    "name": "Early Blight",
    "pathogen": "Alternaria solani (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Concentric target-board rings on mature lower leaves that expand upward.",
    "symptoms": ["Circular dark brown lesions with target rings", "Yellow chlorotic halo around lesions", "Collar rot on stems"],
    "management": ["Prune off lower infected leaves", "Spray Mancozeb 75% WP or Chlorothalonil every 7–10 days"],
    "prevention": ["2-year crop rotation with non-solanaceous crops", "Use drip irrigation at soil base"]
  },
  {
    "id": "tomato-late-blight",
    "crop": "Tomato",
    "name": "Late Blight",
    "pathogen": "Phytophthora infestans (Oomycete)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Water-soaked greasy lesions with white mold on underside in cool humid weather.",
    "symptoms": ["Large irregular water-soaked pale green/brown patches", "White mold on leaf underside in morning humidity", "Rapid stem blackening and total canopy collapse"],
    "management": ["Spray Metalaxyl + Mancozeb (2.5 g/L) immediately", "Destroy heavily infected plants"],
    "prevention": ["Grow resistant hybrid cultivars", "Ensure wide row spacing for air circulation"]
  },
  {
    "id": "tomato-leaf-mold",
    "crop": "Tomato",
    "name": "Leaf Mold",
    "pathogen": "Passalora fulva (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Pale green/yellow spots on upper surface with olive-brown velvety mold underneath.",
    "symptoms": ["Yellow chlorotic spots on upper leaf surface", "Velvety olive-green mold on corresponding lower surface", "Leaves wither and drop"],
    "management": ["Spray Copper Oxychloride or Difenoconazole", "Improve greenhouse ventilation"],
    "prevention": ["Keep relative humidity below 85%", "Prune lower leaves for canopy airflow"]
  },
  {
    "id": "tomato-septoria-leaf-spot",
    "crop": "Tomato",
    "name": "Septoria Leaf Spot",
    "pathogen": "Septoria lycopersici (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Numerous tiny circular spots with gray centers and dark brown margins.",
    "symptoms": ["Tiny circular spots with gray centers and dark borders", "Tiny black speck pycnidia visible inside spots", "Severe bottom-up defoliation"],
    "management": ["Apply Mancozeb or Chlorothalonil as per label dose", "Remove lower infected foliage"],
    "prevention": ["Mulch bed to prevent soil splash", "Disinfect cages and stakes"]
  },
  {
    "id": "tomato-spider-mites",
    "crop": "Tomato",
    "name": "Two-Spotted Spider Mite",
    "pathogen": "Tetranychus urticae (Pest)",
    "type": "Pest",
    "severity": "Moderate",
    "summary": "Tiny yellow stippling and fine silken webs on leaf undersides.",
    "symptoms": ["Fine yellow or white stippling on leaf surface", "Silken webbing on undersides and growing tips", "Foliage bronzes, dries, and drops"],
    "management": ["Spray Spiromesifen (1 ml/L) or Propargite (2 ml/L)", "Spray organic neem oil (5 ml/L + soap)"],
    "prevention": ["Keep border paths moist to reduce dust", "Encourage predatory ladybird beetles"]
  },
  {
    "id": "tomato-target-spot",
    "crop": "Tomato",
    "name": "Target Spot",
    "pathogen": "Corynespora cassiicola (Fungus)",
    "type": "Fungal",
    "severity": "Moderate",
    "summary": "Brown pinpoint spots that expand into concentric target-pattern lesions.",
    "symptoms": ["Brown circular spots with pale centers and yellow halos", "Concentric target rings in mature lesions", "Sunken lesions on green/ripe fruit"],
    "management": ["Spray Azoxystrobin + Difenoconazole or Chlorothalonil", "Clear crop debris after harvest"],
    "prevention": ["Maintain drip irrigation to keep foliage dry", "Follow 3-year crop rotation"]
  },
  {
    "id": "tomato-yellow-leaf-curl",
    "crop": "Tomato",
    "name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
    "pathogen": "Begomovirus transmitted by Whiteflies (Bemisia tabaci)",
    "type": "Viral",
    "severity": "High",
    "summary": "Upward cupping, yellow leaf margins, extreme stunting, and flower drop.",
    "symptoms": ["Severe upward curling and cupping of leaflets", "Marked interveinal yellowing on new growth", "Severe stunting with no fruit set"],
    "management": ["Spray Imidacloprid (0.3 ml/L) to control whitefly vector", "Install yellow sticky traps (20/acre)"],
    "prevention": ["Grow TYLCV-resistant hybrids", "Use insect-proof netting in nurseries"]
  },
  {
    "id": "tomato-mosaic-virus",
    "crop": "Tomato",
    "name": "Tomato Mosaic Virus (ToMV)",
    "pathogen": "Tobamovirus (Mechanically transmitted)",
    "type": "Viral",
    "severity": "Moderate",
    "summary": "Mottled light and dark green mosaic patterns with fern-like leaf distortion.",
    "symptoms": ["Alternating light/dark green mosaic patterns", "Fern-like shoestring leaf distortion", "Internal browning in fruit walls"],
    "management": ["Remove and destroy infected plants immediately", "Wash hands with soap or 10% trisodium phosphate"],
    "prevention": ["Use certified virus-tested seed", "Plant resistant tomato cultivars"]
  },
  {
    "id": "tomato-healthy",
    "crop": "Tomato",
    "name": "Healthy Tomato",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Vibrant, dark green tomato foliage with healthy petioles and flowers.",
    "symptoms": ["Uniform healthy green leaf lamina", "Normal upright growth habit", "Clean healthy stems and buds"],
    "management": ["Maintain regular fertigation schedule", "Stake and prune side shoots for light penetration"],
    "prevention": ["Routine weekly scouting for early pest detection"]
  },

  # Wheat
  {
    "id": "wheat-brown-rust",
    "crop": "Wheat",
    "name": "Brown Rust / Leaf Rust",
    "pathogen": "Puccinia triticina (Fungus)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Small round orange-brown pustules scattered irregularly across leaf blades.",
    "symptoms": ["Small circular to oval orange-brown pustules on upper leaf surface", "Pustules burst to release powdery brown urediniospores", "Premature leaf drying reducing grain weight"],
    "management": ["Spray Propiconazole 25% EC (1 ml/L) or Tebuconazole at first appearance", "Repeat spray after 15 days if cool humid weather persists"],
    "prevention": ["Sow rust-resistant wheat varieties (e.g., HD 2967, PBW 550)", "Avoid late sowing"]
  },
  {
    "id": "wheat-yellow-rust",
    "crop": "Wheat",
    "name": "Yellow Rust / Stripe Rust",
    "pathogen": "Puccinia striiformis (Fungus)",
    "type": "Fungal",
    "severity": "High",
    "summary": "Bright yellow powdery pustules arranged in narrow linear stripes parallel to veins.",
    "symptoms": ["Bright yellow pustules forming distinct continuous linear stripes", "Yellow powder rubs off on fingers", "Severe chlorosis and stunted grain filling"],
    "management": ["Spray Propiconazole 25% EC (Tilt, 1 ml/L) immediately upon detection", "Ensure adequate water coverage (200 L/acre)"],
    "prevention": ["Plant stripe-rust resistant cultivars", "Timely sowing in November to escape late season infection"]
  },
  {
    "id": "wheat-healthy",
    "crop": "Wheat",
    "name": "Healthy Wheat",
    "pathogen": "None (Healthy Plant)",
    "type": "None",
    "severity": "None",
    "healthy": True,
    "summary": "Vigorous upright green wheat leaves with clean flag leaves and healthy earheads.",
    "symptoms": ["Clean, erect linear green leaves", "No pustules, powdery stripes, or spots", "Sturdy tillers with healthy flag leaf"],
    "management": ["Provide timely irrigation at CRI, tillering, flowering, and milk stages", "Top-dress Urea before irrigation"],
    "prevention": ["Seed treatment with biological or chemical protectants"]
  }
]

with open('backend/models/diseases_55.json', 'w', encoding='utf-8') as f:
    json.dump(DISEASES_55, f, indent=2)

print(f"Exported {len(DISEASES_55)} disease profiles to backend/models/diseases_55.json")
