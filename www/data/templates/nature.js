armies.templates.set("nature", new ArmyTemplate("nature", {
    "version": 1,
    "revised": "2018-03-19",
    "name": "Forces of Nature",
    "alignment": "Neutral",
    "masterUnits": {
        "Kindred Tallspears": {
            "id": 0,
            "special": [
                "Elite",
                "Phalanx"
            ],
            "type": 0,
            "units": {
                "Troop": {
                    "points": 100,
                    "models": 10,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 10,
                    "waver": 10,
                    "rout": 12
                },
                "Regiment": {
                    "points": 140,
                    "models": 20,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 15,
                    "waver": 14,
                    "rout": 16
                },
                "Horde": {
                    "points": 230,
                    "models": 40,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 30,
                    "waver": 21,
                    "rout": 23
                }
            }
        },
        "Therennian Sea Guard": {
            "id": 1,
            "special": [
                "Bows",
                "Elite",
                "Phalanx"
            ],
            "type": 0,
            "units": {
                "Regiment": {
                    "points": 170,
                    "models": 20,
                    "speed": 6,
                    "melee": 4,
                    "ranged": 5,
                    "defence": 4,
                    "attacks": 12,
                    "waver": 14,
                    "rout": 16
                },
                "Horde": {
                    "points": 280,
                    "models": 40,
                    "speed": 6,
                    "melee": 4,
                    "ranged": 5,
                    "defence": 4,
                    "attacks": 25,
                    "waver": 21,
                    "rout": 23
                }
            }
        },
        "Palace Guard": {
            "id": 2,
            "special": [
                {
                    "Crushing Strength": 1
                },
                "Elite"
            ],
            "type": 0,
            "units": {
                "Troop": {
                    "points": 105,
                    "models": 10,
                    "speed": 6,
                    "melee": 3,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 10,
                    "waver": 11,
                    "rout": 13
                },
                "Regiment": {
                    "points": 150,
                    "models": 20,
                    "speed": 6,
                    "melee": 3,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 12,
                    "waver": 15,
                    "rout": 17
                }
            }
        },
        "Kindred Archers": {
            "id": 3,
            "special": [
                "Bows",
                "Elite"
            ],
            "type": 0,
            "units": {
                "Troop": {
                    "points": 105,
                    "models": 10,
                    "speed": 6,
                    "melee": 5,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 8,
                    "waver": 10,
                    "rout": 12
                },
                "Regiment": {
                    "points": 150,
                    "models": 20,
                    "speed": 6,
                    "melee": 5,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 10,
                    "waver": 14,
                    "rout": 16
                },
                "Horde": {
                    "points": 250,
                    "models": 40,
                    "speed": 6,
                    "melee": 5,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 20,
                    "waver": 21,
                    "rout": 23
                }
            }
        },
        "Kindred Gladestalkers": {
            "id": 4,
            "special": [
                "Bows",
                "Elite",
                "Pathfinder",
                "Vanguard"
            ],
            "type": 0,
            "units": {
                "Troop": {
                    "points": 130,
                    "models": 10,
                    "speed": 6,
                    "melee": 4,
                    "ranged": 4,
                    "defence": 3,
                    "attacks": 8,
                    "waver": 10,
                    "rout": 12
                },
                "Regiment": {
                    "points": 175,
                    "models": 20,
                    "speed": 6,
                    "melee": 4,
                    "ranged": 4,
                    "defence": 3,
                    "attacks": 10,
                    "waver": 14,
                    "rout": 16
                }
            }
        },
        "Hunters of the Wild": {
            "id": 5,
            "special": [
                "Pathfinder",
                "Vanguard"
            ],
            "type": 0,
            "units": {
                "Troop": {
                    "points": 135,
                    "models": 10,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 20,
                    "waver": 10,
                    "rout": 12
                },
                "Regiment": {
                    "points": 190,
                    "models": 20,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 25,
                    "waver": 14,
                    "rout": 16
                }
            },
            "options": {
                "The Wild Guard": {
                    "points": 20,
                    "special": [
                        "Headstrong",
                        {
                            "Regeneration": 5
                        }
                    ],
                    "only": "Regiment",
                    "requires": "The Green Lady",
                    "limit": 1
                }
            }
        },
        "Battlecats": {
            "id": 6,
            "irregular": true,
            "special": [
                {
                    "Crushing Strength": [
                        1,
                        "vs Height 0"
                    ],
                    "Height": 0
                },
                "Nimble",
                "Vicious"
            ],
            "type": 0,
            "units": {
                "Troop": {
                    "points": 80,
                    "models": 10,
                    "speed": 7,
                    "melee": 4,
                    "ranged": false,
                    "defence": 2,
                    "attacks": 10,
                    "waver": 10,
                    "rout": 12
                }
            }
        },
        "Forest Shamblers": {
            "id": 7,
            "special": [
                {
                    "Crushing Strength": 1
                },
                "Pathfinder",
                "Shambling",
                "Vanguard"
            ],
            "type": 1,
            "units": {
                "Regiment": {
                    "points": 125,
                    "models": 3,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 9,
                    "waver": false,
                    "rout": 14
                },
                "Horde": {
                    "points": 190,
                    "models": 6,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 18,
                    "waver": false,
                    "rout": 17
                }
            }
        },
        "Stormwind Cavalry": {
            "id": 8,
            "special": [
                "Elite",
                {
                    "Thunderous Charge": 2
                }
            ],
            "type": 2,
            "units": {
                "Troop": {
                    "points": 140,
                    "models": 5,
                    "speed": 9,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 8,
                    "waver": 11,
                    "rout": 13
                },
                "Regiment": {
                    "points": 215,
                    "models": 10,
                    "speed": 9,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 16,
                    "waver": 14,
                    "rout": 16
                }
            }
        },
        "Silverbreeze Cavalry": {
            "id": 9,
            "special": [
                "Bows",
                "Elite",
                "Nimble"
            ],
            "type": 2,
            "units": {
                "Troop": {
                    "points": 145,
                    "models": 5,
                    "speed": 10,
                    "melee": 5,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 7,
                    "waver": 11,
                    "rout": 13
                }
            }
        },
        "The Windborne": {
            "id": 10,
            "special": [
                "Elite",
                "Nimble",
                "Windborne Arrows"
            ],
            "type": 2,
            "legend": true,
            "units": {
                "Troop": {
                    "points": 145,
                    "models": 5,
                    "speed": 10,
                    "melee": 5,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 7,
                    "waver": 11,
                    "rout": 13
                }
            }
        },
        "Drakon Riders": {
            "id": 11,
            "special": [
                {
                    "Crushing Strength": 1
                },
                "Elite",
                "Fly",
                {
                    "Thunderous Charge": 1
                }
            ],
            "type": 3,
            "units": {
                "Regiment": {
                    "points": 175,
                    "models": 3,
                    "speed": 10,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 9,
                    "waver": 12,
                    "rout": 14
                },
                "Horde": {
                    "points": 270,
                    "models": 6,
                    "speed": 10,
                    "melee": 6,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 18,
                    "waver": 15,
                    "rout": 17
                }
            }
        },
        "War Chariots": {
            "id": 12,
            "base": [
                50,
                100
            ],
            "special": [
                "Bows",
                "Elite",
                {
                    "Thunderous Charge": 2
                }
            ],
            "type": 3,
            "units": {
                "Regiment": {
                    "points": 140,
                    "models": 3,
                    "speed": 9,
                    "melee": 4,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 8,
                    "waver": 13,
                    "rout": 15
                },
                "Horde": {
                    "points": 215,
                    "models": 6,
                    "speed": 9,
                    "melee": 4,
                    "ranged": 4,
                    "defence": 5,
                    "attacks": 9,
                    "waver": 16,
                    "rout": 18
                }
            }
        },
        "Bolt Thrower": {
            "id": 13,
            "special": [
                {
                    "Blast": "D3"
                },
                "Elite",
                {
                    "Piercing": 2
                },
                "Reload!"
            ],
            "type": 5,
            "units": {
                "Bolt Thrower": {
                    "points": 90,
                    "models": 1,
                    "speed": 6,
                    "melee": false,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 2,
                    "waver": 10,
                    "rout": 12
                }
            }
        },
        "Dragon Breath": {
            "id": 14,
            "special": [
                {
                    "Breath Attack": "Att"
                },
                "Elite"
            ],
            "type": 5,
            "units": {
                "Dragon Breath": {
                    "points": 90,
                    "models": 1,
                    "speed": 6,
                    "melee": false,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 15,
                    "waver": 10,
                    "rout": 12
                }
            }
        },
        "Elven King": {
            "id": 15,
            "special": [
                {
                    "Crushing Strength": 1
                },
                "Elite",
                "Individual",
                "Inspiring"
            ],
            "type": 10,
            "units": {
                "on foot": {
                    "points": 120,
                    "models": 1,
                    "speed": 6,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 5,
                    "waver": 13,
                    "rout": 15
                },
                "on horse": {
                    "type": 12,
                    "points": 140,
                    "models": 1,
                    "speed": 9,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 5,
                    "waver": 13,
                    "rout": 15
                }
            },
            "options": {
                "Sabre-Toothed Pussycat": {
                    "points": 10
                }
            }
        },
        "Dragon Kindred Lord": {
            "id": 16,
            "special": [
                {
                    "Breath Attack": 15
                },
                {
                    "Crushing Strength": 3
                },
                "Elite",
                "Fly",
                "Inspiring"
            ],
            "type": 14,
            "units": {
                "Dragon Kindred Lord": {
                    "points": 310,
                    "models": 1,
                    "speed": 10,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 10,
                    "waver": 17,
                    "rout": 19
                }
            }
        },
        "Drakon Rider Lord": {
            "id": 17,
            "special": [
                {
                    "Crushing Strength": 1
                },
                "Elite",
                "Fly",
                "Inspiring",
                {
                    "Thunderous Charge": 1
                }
            ],
            "type": 13,
            "units": {
                "Drakon Rider Lord": {
                    "points": 160,
                    "models": 1,
                    "speed": 10,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 5,
                    "waver": 13,
                    "rout": 15
                }
            }
        },
        "Elven Prince": {
            "id": 18,
            "special": [
                {
                    "Crushing Strength": 1
                },
                "Elite",
                "Individual"
            ],
            "type": 10,
            "units": {
                "on foot": {
                    "points": 60,
                    "models": 1,
                    "speed": 6,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 3,
                    "waver": 11,
                    "rout": 13
                },
                "on horse": {
                    "type": 12,
                    "points": 75,
                    "models": 1,
                    "speed": 9,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 3,
                    "waver": 11,
                    "rout": 13
                }
            },
            "options": {
                "Sabre-Toothed Pussycat": {
                    "points": 10
                }
            }
        },
        "Noble War Chariot": {
            "id": 19,
            "base": [
                50,
                100
            ],
            "special": [
                "Bow",
                "Elite",
                "Nimble",
                {
                    "Thunderous Charge": 2
                }
            ],
            "type": 13,
            "units": {
                "Noble War Chariot": {
                    "points": 140,
                    "models": 1,
                    "speed": 9,
                    "melee": 3,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 4,
                    "waver": 11,
                    "rout": 13
                }
            }
        },
        "Elven Mage": {
            "id": 20,
            "special": [
                "Elite",
                "Individual"
            ],
            "type": 10,
            "spells": {
                "Heal": 3
            },
            "units": {
                "on foot": {
                    "points": 75,
                    "models": 1,
                    "speed": 6,
                    "melee": 5,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 1,
                    "waver": 10,
                    "rout": 12
                },
                "on horse": {
                    "points": 90,
                    "type": 12,
                    "models": 1,
                    "speed": 9,
                    "melee": 5,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 1,
                    "waver": 10,
                    "rout": 12
                }
            },
            "options": {
                "spells": {
                    "Lightning Bolt": {
                        "points": 45,
                        "value": 5
                    },
                    "Wind Blast": {
                        "points": 30,
                        "value": 5
                    },
                    "Fireball": {
                        "points": 10,
                        "value": 10
                    },
                    "Bane Chant": {
                        "points": 15,
                        "value": 2
                    }
                },
                "Sabre-Toothed Pussycat": {
                    "points": 10
                }
            }
        },
        "Army Standard Bearer": {
            "id": 21,
            "special": [
                "Elite",
                "Individual",
                "Inspiring"
            ],
            "type": 10,
            "units": {
                "on foot": {
                    "points": 50,
                    "models": 1,
                    "speed": 6,
                    "melee": 5,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 1,
                    "waver": 10,
                    "rout": 12
                },
                "on horse": {
                    "points": 65,
                    "type": 12,
                    "models": 1,
                    "speed": 9,
                    "melee": 5,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 1,
                    "waver": 10,
                    "rout": 12
                }
            }
        },
        "Master Hunter": {
            "id": 22,
            "special": [
                "Bow",
                "Elite",
                "Individual",
                "Pathfinder",
                {
                    "Piercing": 1
                },
                "Stealthy",
                "Vanguard"
            ],
            "type": 10,
            "units": {
                "Master Hunter": {
                    "points": 90,
                    "models": 1,
                    "speed": 6,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 3,
                    "waver": 11,
                    "rout": 13
                }
            },
            "options": {
                "Sabre-Toothed Pussycat": {
                    "points": 10
                }
            }
        },
        "Forest Warden": {
            "id": 23,
            "special": [
                {
                    "Crushing Strength": 2
                },
                "Nimble",
                "Pathfinder",
                "Vanguard"
            ],
            "type": 11,
            "units": {
                "Forest Warden": {
                    "points": 75,
                    "models": 1,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 3,
                    "waver": 11,
                    "rout": 13
                }
            }
        },
        "Tree Herder": {
            "id": 24,
            "special": [
                {
                    "Crushing Strength": 3
                },
                "Inspiring",
                "Pathfinder",
                "Vanguard"
            ],
            "spells": {
                "Surge": 8
            },
            "type": 11,
            "units": {
                "Tree Herder": {
                    "points": 260,
                    "models": 1,
                    "speed": 6,
                    "melee": 3,
                    "ranged": false,
                    "defence": 6,
                    "attacks": 7,
                    "waver": 18,
                    "rout": 20
                }
            }
        },
        "Argus Rodinar": {
            "id": 25,
            "base": [
                50,
                50
            ],
            "special": [
                "Altar of the Elements",
                "Elite",
                "Individual"
            ],
            "legend": true,
            "type": 10,
            "units": {
                "Argus Rodinar": {
                    "points": 50,
                    "models": 1,
                    "speed": 0,
                    "melee": false,
                    "ranged": false,
                    "defence": 5,
                    "attacks": false,
                    "waver": false,
                    "rout": 13
                }
            }
        },
        "The Green Lady": {
            "id": 26,
            "special": [
                "Elite",
                "Fly",
                "Individual",
                "Inspiring",
                "Pathfinder",
                {
                    "Regeneration": 5
                }
            ],
            "legend": true,
            "type": 10,
            "units": {
                "The Green Lady": {
                    "points": 200,
                    "models": 1,
                    "speed": 10,
                    "melee": false,
                    "ranged": false,
                    "defence": 6,
                    "attacks": false,
                    "waver": 14,
                    "rout": 16
                }
            },
            "spells": {
                "Heal": 8
            },
            "options": {
                "Sabre-Toothed Pussycat": {
                    "points": 10,
                    "quantity": 2
                }
            }
        },
        "Tydarion Dragonlord": {
            "id": 27,
            "base": [
                75,
                75
            ],
            "special": [
                {
                    "Breath Attack": 15
                },
                {
                    "Crushing Strength": 4
                },
                "Elite",
                "Heavy Flier",
                "Very Inspiring"
            ],
            "legend": true,
            "type": 14,
            "units": {
                "Tydarion Dragonlord": {
                    "points": 350,
                    "models": 1,
                    "speed": 8,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 12,
                    "waver": 19,
                    "rout": 21
                }
            }
        }
    }
}));