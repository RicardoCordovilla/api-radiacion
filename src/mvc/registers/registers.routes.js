const router = require('express').Router()
const registersServices = require('./registers.services')

router.post('/', registersServices.createRegister)

router.get('/', registersServices.getAllRegisters)
router.get('/:station', registersServices.getRegisters)
router.get('/:station/date', registersServices.getRegistersByDate)
router.get('/:station/last', registersServices.getLast)


router.delete('/delete/:id', registersServices.deleteRegister)

module.exports = router