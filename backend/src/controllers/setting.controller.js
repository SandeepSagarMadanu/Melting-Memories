import prisma from '../utils/prisma.js';

// Seed Initial Settings
export const seedSettings = async () => {
  try {
    const defaultSettings = [
      { key: 'WHATSAPP_NUMBER', value: '+919441251145' },
      { key: 'STORE_EMAIL', value: 'meltingmemories0102@gmail.com' },
      { key: 'STORE_ADDRESS', value: 'Hayathnagar, Hyderabad, Telangana, India' },
      { key: 'INSTAGRAM_URL', value: 'https://www.instagram.com/melting_memories__/' },
      { key: 'SHIPPING_CHARGES', value: '50' },
      { key: 'TAX_RATE', value: '0.05' } // 5% GST
    ];

    for (const setting of defaultSettings) {
      const exists = await prisma.setting.findUnique({
        where: { key: setting.key }
      });
      if (!exists) {
        await prisma.setting.create({ data: setting });
      }
    }
    console.log('✅ Default settings seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding default settings:', error);
  }
};

export const getSettings = async (req, res) => {
  try {
    const settingsList = await prisma.setting.findMany();
    // Convert array to object key-value pairs
    const settings = {};
    settingsList.forEach(item => {
      settings[item.key] = item.value;
    });
    res.json(settings);
  } catch (error) {
    console.error('Get Settings Error:', error);
    res.status(500).json({ message: 'Error retrieving store settings.' });
  }
};

export const updateSettingsAdmin = async (req, res) => {
  try {
    const { settings } = req.body; // Expects object: { WHATSAPP_NUMBER: '...', ... }
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Invalid settings object format.' });
    }

    const updatePromises = Object.entries(settings).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });

    await Promise.all(updatePromises);
    
    // Retrieve fresh settings
    const freshSettingsList = await prisma.setting.findMany();
    const freshSettings = {};
    freshSettingsList.forEach(item => {
      freshSettings[item.key] = item.value;
    });

    res.json({ message: 'Settings updated successfully.', settings: freshSettings });
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({ message: 'Error updating settings.' });
  }
};
