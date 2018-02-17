const GenerateKSP = require('./generator.js').default;
const { keys, path } = require('ramda');

export const createKSP = (config) => {
    const ksp = new GenerateKSP(config)
    
    startOnInit(ksp)
        initialization(ksp, config, 1)
        declareComponents(ksp, config, 1)

        setDefaultValues(ksp, config, 1)

        groupsAndSlots(ksp, config, 1)
        powerComponents(ksp, config, 1)

        makePersistant(ksp, config, 1)
        readPersistant(ksp, config, 1)
    endOn(ksp)


    ksp.closeFile()
}

const startOnInit = (ksp) => {
    ksp.writeCode('on init', 0)
}

const endOn = (ksp) => {
    ksp.writeCode('end on', 0)
}

const initialization = (ksp, config, tabLevel) => {
    ksp.writeCode(`message("")`, tabLevel)
    ksp.writeCode(`make_perfview`, tabLevel)	
    ksp.writeCode(`set_ui_height_px(${config.uiHeight})`, tabLevel)		
}

const declareComponents = (ksp, config, tabLevel) => {
    const uic = path(['uiComponents'], config);
    keys(uic).forEach((comp) => {
        ksp.writeComment(`Declare UI Components - ${comp}`, tabLevel)
        let uiArray = `%ui_${comp.slice(0, -1)}_id`
        let uiArrayLength =  keys(path([comp], uic)).length
        let id_array = []
        let units_array = []
        ksp.writeCode(`declare ${uiArray}[${uiArrayLength}]`, tabLevel)
        keys(path([comp], uic)).forEach((key, i) => {
            const item = path([comp, key], uic)
            switch (comp) {
                case 'knobs':
                    ksp.writeCode(`declare ui_knob ${item.variableName} (${item.min}, ${item.max}, 1)`, tabLevel)
                    // Save units
                    units_array.push(`set_knob_unit(${item.variableName}, ${item.unit})`)
                break;

                case 'sliders':
                    ksp.writeCode(`declare ui_slider ${item.variableName} (${item.min}, ${item.max})`, tabLevel)
                break
            }

            // Save id array for after declarations
            id_array.push(`${uiArray}[${i}] = get_ui_id(${item.variableName})`)

        })

        // Write id array code
        units_array.forEach(item => ksp.writeCode(item, tabLevel))
        
        // Write id array code
        id_array.forEach(item => ksp.writeCode(item, tabLevel))
    });
}

const setDefaultValues = (ksp, config, tabLevel) => {
    const uic = path(['uiComponents'], config);
    ksp.writeComment(`Set Default Values`, tabLevel)
    keys(uic).forEach((comp) => {
        keys(path([comp], uic)).forEach((key, i) => {
            const item = path([comp, key], uic)
            let defaultValue = 0 // Could be a config quesiton
            ksp.writeCode(`set_knob_defval(${item.variableName}, ${defaultValue})`, tabLevel)
        })
    });
}

// This is all static right now...should be configurable
const groupsAndSlots = (ksp, config, tabLevel) => {
    ksp.writeComment(`Setting Group and Env`, tabLevel)
    
    ksp.writeCode(`declare $group_idx`, tabLevel)
    ksp.writeCode(`declare $slot_idx`, tabLevel)
    ksp.writeCode(`$group_idx := 0`, tabLevel)
    ksp.writeCode(`$slot_idx := 0`, tabLevel)
}

const powerComponents = (ksp, config, tabLevel) => {
    const uic = path(['uiComponents'], config);
    ksp.writeComment(`Power Variables`, tabLevel)
    keys(uic).forEach((comp) => {
        keys(path([comp], uic)).forEach((key, i) => {
            const item = path([comp, key], uic)
            // indexs are static for now
            ksp.writeCode(`${item.variableName} := get_engine_par(${item.componentFunction}, $group_idx, $slot_idx, -1)`, tabLevel)
        })
    });
}

const makePersistant = (ksp, config, tabLevel) => {
    const uic = path(['uiComponents'], config);
    ksp.writeComment(`Make Variable Persistant`, tabLevel)
    keys(uic).forEach((comp) => {
        keys(path([comp], uic)).forEach((key, i) => {
            const item = path([comp, key], uic)
            ksp.writeCode(`make_persistent(${item.variableName})`, tabLevel)
        })
    });
}

const readPersistant = (ksp, config, tabLevel) => {
    const uic = path(['uiComponents'], config);
    ksp.writeComment(`Read Persistant Variable`, tabLevel)
    keys(uic).forEach((comp) => {
        keys(path([comp], uic)).forEach((key, i) => {
            const item = path([comp, key], uic)
            ksp.writeCode(`read_persistent_var(${item.variableName})`, tabLevel)
        })
    });
}