const ModerationStatus = Object.freeze({
    PENDING: 'PENDING',
    APPROVED:'APPROVED',
    REJECTED:'REJECTED',
    MODERATED: 'MODERATED'
});

module.exports = {ModerationStatus}; // nodeJs by default expecting common JS syntax module, do need to use module.exports instead of exports