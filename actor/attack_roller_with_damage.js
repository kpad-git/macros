// This macro is an example of how to roll attack and damage in one shot with a macro to speed up gameplay.
// Written for 5e system, but probably easy to translate to others.
// It's not 100% done, but illustrates how to look up various properties on the actor.
// The only thing that a user would change is the item name near the top, the rest *should* work automatically.

if (actor) {
    ////////////////////////////
    // Player Setup
    let name="Rapier"
    ////////////////////////////

    // Macro starts here
    let is_crit=0
    let atk_die_roll=0

//	console.log(actor)

    AudioHelper.play({src: "audio/Effects/dice.wav", volume: 0.8, autoplay: true, loop: false}, true);
    
    // Find the image of the item
    const items = actor ? actor.items.filter(i => i.name === name) : [];
    if ( items.length > 1 ) {
        ui.notifications.warn(`Your controlled Actor ${actor.name} has more than one Item with name ${name}. The first matched item will be chosen.`);
    } else if ( items.length === 0 ) {
        ui.notifications.warn(`Your controlled Actor does not have an item named ${name}`);
    }
    const item = items[0];

    let dmg_die_string = item.data.data.damage.parts[0][0]   // Can replace with hard-coded value if needed
    
    // Consider attack bonuses for melee and ranged weapons
    let atk_mod = 0;
    let dmg_mod = 0;

    if (item.data.data.actionType == "rwak") {
		atk_mod = actor.data.data.abilities.dex.mod + actor.data.data.attributes.prof
		if (actor.data.data.bonuses.rwak.attack) {
	        atk_mod += parseInt(actor.data.data.bonuses.rwak.attack)
		}
		dmg_mod = actor.data.data.abilities.dex.mod
		if (actor.data.data.bonuses.rwak.damage) {
        	dmg_mod += parseInt(actor.data.data.bonuses.rwak.damage)
		}
    }
    else if (item.data.data.actionType == "mwak") {
		if (item.data.data.properties.fin) {
			atk_mod = Math.max(actor.data.data.abilities.str.mod, actor.data.data.abilities.dex.mod) + actor.data.data.attributes.prof
			dmg_mod = Math.max(actor.data.data.abilities.str.mod, actor.data.data.abilities.dex.mod)
		}
		else {
			atk_mod = actor.data.data.abilities.str.mod + actor.data.data.attributes.prof
			dmg_mod = actor.data.data.abilities.str.mod
		}

		if (actor.data.data.bonuses.mwak.attack) {
	        atk_mod += parseInt(actor.data.data.bonuses.mwak.attack)
		}
		if (actor.data.data.bonuses.mwak.damage) {
        	dmg_mod += parseInt(actor.data.data.bonuses.mwak.damage)
		}
    }
	else if (item.data.data.actionType == "rsak") {
		let spell_mod = 0
		if (actor.data.data.attributes.spellcasting == "str") { spell_mod = actor.data.data.abilities.str.mod }
		else if (actor.data.data.attributes.spellcasting == "dex") { spell_mod = actor.data.data.abilities.dex.mod }
		else if (actor.data.data.attributes.spellcasting == "con") { spell_mod = actor.data.data.abilities.con.mod }
		else if (actor.data.data.attributes.spellcasting == "wis") { spell_mod = actor.data.data.abilities.wis.mod }
		else if (actor.data.data.attributes.spellcasting == "int") { spell_mod = actor.data.data.abilities.int.mod }
		else if (actor.data.data.attributes.spellcasting == "cha") { spell_mod = actor.data.data.abilities.cha.mod }
		atk_mod = spell_mod + actor.data.data.attributes.prof
		if (actor.data.data.bonuses.rsak.attack) {
	        atk_mod += parseInt(actor.data.data.bonuses.rsak.attack)
		}
		dmg_mod = actor.data.data.abilities.dex.mod
		if (actor.data.data.bonuses.rsak.damage) {
        	dmg_mod += parseInt(actor.data.data.bonuses.rsak.damage)
		}
	}
	else if (item.data.data.actionType == "msak") {
		let spell_mod = 0
		if (actor.data.data.attributes.spellcasting == "str") { spell_mod = actor.data.data.abilities.str.mod }
		else if (actor.data.data.attributes.spellcasting == "dex") { spell_mod = actor.data.data.abilities.dex.mod }
		else if (actor.data.data.attributes.spellcasting == "con") { spell_mod = actor.data.data.abilities.con.mod }
		else if (actor.data.data.attributes.spellcasting == "wis") { spell_mod = actor.data.data.abilities.wis.mod }
		else if (actor.data.data.attributes.spellcasting == "int") { spell_mod = actor.data.data.abilities.int.mod }
		else if (actor.data.data.attributes.spellcasting == "cha") { spell_mod = actor.data.data.abilities.cha.mod }
		atk_mod = spell_mod + actor.data.data.attributes.prof
		if (actor.data.data.bonuses.msak.attack) {
	        atk_mod += parseInt(actor.data.data.bonuses.msak.attack)
		}
		dmg_mod = actor.data.data.abilities.dex.mod
		if (actor.data.data.bonuses.msak.damage) {
        	dmg_mod += parseInt(actor.data.data.bonuses.msak.damage)
		}
	}


    // Roll the attack
	let atk_string = "1d20"
	if (actor.data.flags.dnd5e.halflingLucky) {
		atk_string = "1d20r=1"
	}
    let atk_roll=new Roll(atk_string)
    atk_roll.roll()
	console.log(atk_roll)
    
    // Was it critical?
    if (atk_roll.total == 20) {
        is_crit = 1
    }
    
    // Roll the damage
    let dmg_roll = []
    if (is_crit == 1) {
        dmg_roll = new Roll (dmg_die_string + "+" + dmg_die_string + "+" + dmg_mod)
    }
    else {
        dmg_roll = new Roll (dmg_die_string + "+" + dmg_mod)
    }
    dmg_roll.roll()
    let dmg_total = dmg_roll.total
    if (is_crit == 1) {
        let bonus_dmg_roll = new Roll (dmg_die_string)
        bonus_dmg_roll.roll()
        dmg_total += bonus_dmg_roll.total
    }
    
    // Build the final string
    let atk_score = parseInt(atk_roll.total) + parseInt(atk_mod)
    if (is_crit == 1) {
        atk_score = "<strong style=color:red>CRIT!</strong>"
    }
    let img_html=""
    if (item) {
        img_html += "<img style=vertical-align:middle;float:left; src=\"" + item.img + "\" width=36 height=36;/>"
    }
    let atk_roll_html= "<span style=font-size:16px;><strong>&nbsp" + name + " Attack Roll:</strong></span>&nbsp&nbsp&nbsp<span style=color:black;font-size:20px;>" + atk_score + "</span><br>"
    let atk_actual_die_html = "<span style=font-size:12px;>&nbsp&nbspDie Roll: " + atk_roll.total + "</span>"
    let damage_header_html = "<br><span style=font-size:14px;>Damage:</span>"
    let result_string = img_html + atk_roll_html + atk_actual_die_html + damage_header_html
    
    let chatData = {
        speaker: { actor: "actor", alias: actor.name },
        content: result_string,
        flavor: result_string,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: dmg_roll
    }
    ChatMessage.create(chatData);
} else {
    ui.notifications.error(`You must have an actor selected`);
}

