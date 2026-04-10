import { sendContactEmail } from '../services/contact.js'

export const handleContact = async (request, response) => {
    try {
        const { name, email, subject, message } = request.body

        // Validasi kelengkapan data menggunakan Array method (.some)
        const requiredFields = [name, email, subject, message]
        const hasEmptyFields = requiredFields.some(field => !field?.trim())

        if (hasEmptyFields) {
            return response.status(400).json({ message: 'Semua field harus diisi' })
        }

        // Pengecekan format surel/email
        const mailFormatValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!mailFormatValidator.test(email)) {
            return response.status(400).json({ message: 'Format email tidak valid' })
        }

        // Eksekusi pengiriman via service
        await sendContactEmail({ 
            name: name.trim(), 
            email: email.trim(), 
            subject: subject.trim(), 
            message: message.trim() 
        })

        return response.json({ 
            message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.' 
        })

    } catch (err) {
        console.error('Contact form transmission failure:', err)
        return response.status(500).json({ 
            message: 'Gagal mengirim pesan. Silakan coba lagi nanti.' 
        })
    }
}