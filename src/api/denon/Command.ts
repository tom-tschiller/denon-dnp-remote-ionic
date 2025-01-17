// Network commands based on https://assets.denon.com/documentmaster/master/avr2112ci_avr1912_protocol_v740.pdf (page 21)
export enum Command {
    PowerOn = 'PWON',
    PowerStandby = 'PWSTANDBY',
    CursorUp = 'NS90',
    CursorDown = 'NS91',
    CursorLeft = 'NS92',
    CursorRight = 'NS93',
    Enter = 'NS94',
    PageNext = 'NS9X',
    PagePrevious = 'NS9Y',
}