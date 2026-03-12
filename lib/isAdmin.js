// isAdmin.js - Version simplifiée et corrigée
async function isAdmin(sock, chatId, senderId) {
    try {
        // Vérifier si c'est un groupe
        if (!chatId.endsWith('@g.us')) {
            return { isSenderAdmin: false, isBotAdmin: false };
        }

        // Récupérer les infos du groupe
        const groupMetadata = await sock.groupMetadata(chatId);
        
        if (!groupMetadata || !groupMetadata.participants) {
            return { isSenderAdmin: false, isBotAdmin: false };
        }

        const participants = groupMetadata.participants;
        
        // Récupérer l'ID du bot depuis la connexion
        const botId = sock.user?.id ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : '';
        
        // Nettoyer les IDs
        const cleanSenderId = senderId.split('@')[0];
        const cleanBotId = botId.split('@')[0];

        // Vérifier si l'expéditeur est admin
        const senderParticipant = participants.find(p => 
            p.id === senderId || p.id.split('@')[0] === cleanSenderId
        );
        
        const isSenderAdmin = senderParticipant ? 
            (senderParticipant.admin === 'admin' || senderParticipant.admin === 'superadmin') : 
            false;

        // Vérifier si le bot est admin
        const botParticipant = participants.find(p => 
            p.id === botId || p.id.split('@')[0] === cleanBotId
        );
        
        const isBotAdmin = botParticipant ? 
            (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin') : 
            false;

        return { isSenderAdmin, isBotAdmin };
        
    } catch (err) {
        console.error('❌ Error in isAdmin:', err);
        return { isSenderAdmin: false, isBotAdmin: false };
    }
}

module.exports = isAdmin;
