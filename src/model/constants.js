module.exports = Object.freeze({
    DATA_DID_CHANGE: 'dataDidChange',

    REG_EXP_KEY_VALUE: /^(\w+)[=:\s]+([\S\s]+?[^\\])(?=$)/gm,

    REG_EXP_NEW_LINE: /\r?\n|\r/g,

    REG_EXP_EXTRA_SPACES: /\s{2,}/g,

    REG_EXP_EXTRA_LINES: /\\/g
});
