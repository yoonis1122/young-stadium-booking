require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Stadium = require('./models/Stadium');
const TimeSlot = require('./models/TimeSlot');

const seed = async () => {
    await connectDB();

    // Clear existing
    await User.deleteMany({});
    await Stadium.deleteMany({});
    await TimeSlot.deleteMany({});

    // Admin user
    const admin = await User.create({
        name: 'Admin',
        email: 'admin@youngstadiums.com',
        password: 'admin123456',
        role: 'admin',
        phone: '+966500000000',
    });

    // Sample stadiums
    const stadiums = await Stadium.insertMany([
        {
            name: 'Al-Noor Arena',
            location: 'Riyadh, Saudi Arabia',
            description: 'A premium mini-stadium with top-quality artificial grass and full lighting.',
            image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
            sizesAvailable: [
                { label: '3+GK', maxPlayers: 8, pricePerHour: 150 },
                { label: '4+GK', maxPlayers: 10, pricePerHour: 200 },
            ],
            pricePerHour: 150,
            isActive: true,
        },
        {
            name: 'Green Field Stadium',
            location: 'Jeddah, Saudi Arabia',
            description: 'Indoor climate-controlled stadium perfect for year-round play.',
            image: 'https://images.unsplash.com/photo-1456719762134-586f7e7da914?w=800',
            sizesAvailable: [
                { label: '3+GK', maxPlayers: 8, pricePerHour: 120 },
                { label: '4+GK', maxPlayers: 10, pricePerHour: 180 },
                { label: '5+GK', maxPlayers: 12, pricePerHour: 250 },
            ],
            pricePerHour: 120,
            isActive: true,
        },
        {
            name: 'Champions Court',
            location: 'Dammam, Saudi Arabia',
            description: 'High-end facility with professional turf and changing rooms.',
            image: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=800',
            sizesAvailable: [
                { label: '3+GK', maxPlayers: 8, pricePerHour: 130 },
                { label: '4+GK', maxPlayers: 10, pricePerHour: 190 },
            ],
            pricePerHour: 130,
            isActive: true,
        },
        {
            name: 'Sky Pitch',
            location: 'Riyadh, Saudi Arabia',
            description: 'Rooftop stadium with panoramic views. A unique experience for players.',
            image: 'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=800',
            sizesAvailable: [
                { label: '3+GK', maxPlayers: 8, pricePerHour: 200 },
                { label: '4+GK', maxPlayers: 10, pricePerHour: 280 },
            ],
            pricePerHour: 200,
            isActive: true,
        },
    ]);

    // Create time slots for today and tomorrow for first stadium
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const fmt = (d) => d.toISOString().split('T')[0];

    const hourlySlots = [
        { startTime: '08:00', endTime: '09:00' },
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '11:00' },
        { startTime: '11:00', endTime: '12:00' },
        { startTime: '14:00', endTime: '15:00' },
        { startTime: '15:00', endTime: '16:00' },
        { startTime: '16:00', endTime: '17:00' },
        { startTime: '17:00', endTime: '18:00' },
        { startTime: '18:00', endTime: '19:00' },
        { startTime: '19:00', endTime: '20:00' },
    ];

    for (const stadium of stadiums) {
        for (const date of [fmt(today), fmt(tomorrow)]) {
            const slots = hourlySlots.map((s) => ({
                stadiumId: stadium._id,
                date,
                startTime: s.startTime,
                endTime: s.endTime,
                isBooked: false,
            }));
            await TimeSlot.insertMany(slots);
        }
    }

    console.log('✅ Seed complete!');
    console.log('👤 Admin: admin@youngstadiums.com / admin123456');
    process.exit(0);
};

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
