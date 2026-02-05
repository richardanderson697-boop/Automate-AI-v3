import { addKnowledge } from '@/lib/rag-service'

const knowledgeData = [
  {
    title: 'P0420 - Catalyst System Efficiency Below Threshold',
    content: 'The P0420 code indicates that the catalytic converter is not operating efficiently. Common causes include: failed oxygen sensors (upstream or downstream), exhaust leaks before the catalytic converter, engine misfires causing unburned fuel to reach the catalyst, or a failing catalytic converter itself. Diagnosis should start with checking oxygen sensor readings and exhaust system integrity before replacing the expensive catalytic converter.',
    category: 'Engine',
    tags: ['check-engine-light', 'emissions', 'oxygen-sensor', 'catalytic-converter', 'OBD-II'],
  },
  {
    title: 'Rough Idle and Engine Misfire Diagnosis',
    content: 'A rough idle or engine misfire can be caused by multiple factors: worn spark plugs or ignition coils, vacuum leaks, dirty fuel injectors, low compression in cylinders, or faulty oxygen sensors. Start diagnosis by checking spark plugs for wear (replace every 30,000-100,000 miles depending on type). Scan for misfire codes (P0300-P0308) to identify specific cylinders. Check for vacuum leaks using smoke test. Clean or replace fuel injectors if carbon buildup is present.',
    category: 'Engine',
    tags: ['misfire', 'rough-idle', 'spark-plugs', 'ignition-coils', 'fuel-injectors'],
  },
  {
    title: 'Oxygen Sensor Replacement Procedure',
    content: 'Modern vehicles have 2-4 oxygen sensors: upstream (before catalyst) and downstream (after catalyst). Upstream sensors monitor air-fuel mixture for engine management, while downstream sensors monitor catalyst efficiency. Failed upstream sensors cause poor fuel economy and performance issues. Failed downstream sensors trigger P0420/P0430 codes. Replace sensors in pairs (both upstreams or both downstreams) for best results. Use anti-seize on threads and torque to 30-35 lb-ft.',
    category: 'Exhaust',
    tags: ['oxygen-sensor', 'o2-sensor', 'emissions', 'fuel-economy'],
  },
  {
    title: 'Serpentine Belt Inspection and Replacement',
    content: 'Serpentine belts should be inspected every 30,000 miles and replaced every 60,000-100,000 miles. Look for: cracks on the ribbed side, glazing, chunks missing, or fraying. A squealing noise on startup indicates belt slip (worn belt or weak tensioner). Chirping noises can indicate misalignment. Always check belt tensioner and idler pulleys - if bearings are worn, they will destroy a new belt quickly. Replace belt and tensioner together for best results.',
    category: 'Engine',
    tags: ['serpentine-belt', 'drive-belt', 'belt-tensioner', 'squealing-noise'],
  },
  {
    title: 'Alternator Bearing Failure Symptoms',
    content: 'A failing alternator bearing produces a high-pitched whining or grinding noise that increases with engine RPM. The noise is often most noticeable when electrical load is high (headlights, AC, radio on). Other symptoms include: battery warning light, dimming lights, electrical issues, or battery repeatedly dying. Test alternator output (should be 13.5-14.5V with engine running). If bearings are worn but alternator still charges, replacement is urgent to prevent complete failure and potential belt damage.',
    category: 'Electrical',
    tags: ['alternator', 'bearing-noise', 'charging-system', 'whining-noise'],
  },
  {
    title: 'Battery Terminal Corrosion Prevention and Cleaning',
    content: 'White or blue-green powder on battery terminals is corrosion caused by acid vapor escaping the battery. This increases resistance and can prevent starting. Clean terminals by: disconnecting negative (-) first, then positive (+), using baking soda solution (1 tbsp per cup water) to neutralize acid, scrubbing with wire brush, rinsing with water, drying thoroughly, reconnecting positive first then negative, and applying terminal protection spray or petroleum jelly. Check battery age - most last 3-5 years.',
    category: 'Electrical',
    tags: ['battery', 'corrosion', 'battery-terminals', 'no-start'],
  },
  {
    title: 'Brake Pad Wear Indicators and Replacement',
    content: 'Brake pads should be replaced when pad material is 3mm thick or less. Warning signs include: squealing noise (wear indicator tab touching rotor), grinding noise (metal-on-metal - emergency), vibration when braking (warped rotors), or vehicle pulling to one side. Always replace pads in axle sets (both front or both rear). Inspect rotors for scoring, hot spots, or warping - resurface if thickness is above minimum spec, otherwise replace. Brake fluid should be flushed when doing brake jobs.',
    category: 'Brakes',
    tags: ['brake-pads', 'brake-service', 'squealing-brakes', 'brake-rotors'],
  },
  {
    title: 'Engine Oil Change Intervals and Specifications',
    content: 'Modern synthetic oils can go 7,500-10,000 miles between changes, but severe conditions (short trips, extreme temps, towing) require more frequent changes (3,000-5,000 miles). Always use oil viscosity specified in owner\'s manual (commonly 0W-20, 5W-30, or 5W-40). Check oil level monthly - low oil causes engine damage. Look for oil leaks, excessive consumption (more than 1 qt per 1,000 miles), or oil that smells like gas (indicates fuel system issue).',
    category: 'Maintenance',
    tags: ['oil-change', 'engine-oil', 'maintenance', 'oil-viscosity'],
  },
  {
    title: 'Transmission Fluid Service and Issues',
    content: 'Automatic transmission fluid should be checked regularly and serviced per manufacturer schedule (often 30,000-60,000 miles). Signs of transmission problems include: delayed engagement, harsh or erratic shifting, slipping (RPMs rise without acceleration), shuddering, or whining noises. Check fluid level when hot and running in Park - should be pink/red and smell sweet. Dark brown or burnt-smelling fluid indicates overheating and requires immediate service. Never overfill transmission.',
    category: 'Transmission',
    tags: ['transmission', 'ATF', 'transmission-fluid', 'shifting-issues'],
  },
  {
    title: 'Tire Pressure and Tread Depth Monitoring',
    content: 'Check tire pressure monthly when tires are cold. Correct pressure is listed on driver door jamb sticker, NOT on tire sidewall (that\'s max pressure). Under-inflation causes excessive wear on outer edges and poor fuel economy. Over-inflation causes center wear and harsh ride. Check tread depth using penny test (Lincoln\'s head upside down - if you see top of head, replace tire). Legal minimum is 2/32", but replace at 4/32" for safety. Rotate tires every 5,000-7,500 miles.',
    category: 'Tires',
    tags: ['tire-pressure', 'tread-depth', 'tire-rotation', 'TPMS'],
  },
  {
    title: 'Cooling System Overheating Diagnosis',
    content: 'Engine overheating can be caused by: low coolant level, thermostat stuck closed, radiator blockage, water pump failure, cooling fan malfunction, or head gasket failure. Check coolant level when cold - add 50/50 mix of coolant and distilled water. Look for leaks, check radiator cap condition, test thermostat operation (engine should warm up to 195-220°F in 10-15 min), verify cooling fans engage when hot. White smoke from exhaust + coolant loss = head gasket failure.',
    category: 'Cooling',
    tags: ['overheating', 'coolant', 'radiator', 'thermostat', 'water-pump'],
  },
  {
    title: 'Air Filter Replacement and Engine Performance',
    content: 'Engine air filter should be replaced every 15,000-30,000 miles or when visibly dirty. A clogged air filter restricts airflow causing: reduced power and acceleration, decreased fuel economy, rough idle, and check engine light (lean mixture codes). Inspect filter by holding up to light - should see light through it. Paper filters are not washable. K&N style reusable filters can be cleaned and re-oiled every 50,000 miles. Always check air intake system for leaks when replacing filter.',
    category: 'Engine',
    tags: ['air-filter', 'intake', 'fuel-economy', 'engine-performance'],
  },
  {
    title: 'Suspension Noise Diagnosis - Struts and Shocks',
    content: 'Worn struts and shocks cause: bouncing after bumps, nose diving when braking, body roll in turns, uneven tire wear, and clunking noises over bumps. Bounce test: push down corner of vehicle and release - should bounce once and settle. If it bounces 2+ times, shocks are worn. Inspect for oil leaks on shock body. Replace in pairs (both fronts or both rears). Also check control arm bushings, ball joints, and sway bar links for wear as they cause similar symptoms.',
    category: 'Suspension',
    tags: ['struts', 'shocks', 'suspension-noise', 'clunking', 'bouncing'],
  },
  {
    title: 'Steering System Issues and Power Steering Fluid',
    content: 'Power steering problems manifest as: hard steering, whining noise when turning, steering wheel vibration, or wandering. Check power steering fluid level (some systems are sealed). Fluid should be clean red/amber color - dark brown indicates contamination. Common issues: leaking pump, worn rack and pinion, loose steering gear, or bad tie rod ends. Whining that increases with RPM = pump failure. Groaning when turning at low speed = low fluid or worn pump.',
    category: 'Steering',
    tags: ['power-steering', 'steering-noise', 'hard-steering', 'rack-and-pinion'],
  },
  {
    title: 'Check Engine Light - Common Causes and Diagnosis',
    content: 'The check engine light (CEL) indicates the engine control computer detected a problem. Common causes: loose gas cap (try tightening and see if light clears after a few drive cycles), failed oxygen sensor, faulty mass airflow sensor, failing catalytic converter, or ignition system issues. Always scan for codes using OBD-II scanner - code points to system/circuit with problem. Some codes require further diagnosis. Flashing CEL = severe misfire that can damage catalytic converter - stop driving immediately.',
    category: 'Engine',
    tags: ['check-engine-light', 'OBD-II', 'diagnostic-codes', 'CEL'],
  },
]

export async function seedKnowledgeBase() {
  console.log('[v0] Starting knowledge base seeding...')
  
  for (const item of knowledgeData) {
    const result = await addKnowledge(
      item.title,
      item.content,
      item.category,
      item.tags
    )
    
    if (result) {
      console.log(`[v0] Added: ${item.title}`)
    } else {
      console.error(`[v0] Failed to add: ${item.title}`)
    }
    
    // Add delay to avoid rate limiting on API calls
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('[v0] Knowledge base seeding complete!')
}

// Run the seeder
seedKnowledgeBase()
