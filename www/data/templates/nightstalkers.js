armies.templates.set("nightstalkers", new ArmyTemplate("nightstalkers", {
    "version": 1,
    "revised": "2018-04-03",
    "name": "Night Stalkers",
    "alignment": "Evil",
    "masterUnits": {
        "Spectres": {
            "id": 0,
            "special": [
                "Firebolt",
                "Pathfinder",
                {
                    "Piercing": 1
                },
                "Stealthy"
            ],
            "type": 0,
            "units": {
                "Troop": {
                    "points": 100,
                    "models": 10,
                    "speed": 6,
                    "melee": 6,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 8,
                    "waver": 10,
                    "rout": 13
                },
                "Regiment": {
                    "points": 140,
                    "models": 20,
                    "speed": 6,
                    "melee": 6,
                    "ranged": 4,
                    "defence": 3,
                    "attacks": 10,
                    "waver": 14,
                    "rout": 17
                }
            }
        },
        "Blood Worms": {
            "id": 1,
            "special": [
                {
                    "Lifeleech": 2
                },
                "Stealthy"
            ],
            "type": 0,
            "units": {
                "Regiment": {
                    "points": 120,
                    "models": 20,
                    "speed": 5,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 15,
                    "waver": 11,
                    "rout": 14
                },
                "Horde": {
                    "points": 200,
                    "models": 40,
                    "speed": 5,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 30,
                    "waver": 17,
                    "rout": 20
                },
                "Legion": {
                    "points": 290,
                    "models": 60,
                    "speed": 5,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 40,
                    "waver": 23,
                    "rout": 26
                }
            }
        },
        "Reapers": {
            "id": 2,
            "special": [
                {
                    "Crushing Strength": 1
                },
                "Stealthy"
            ],
            "type": 0,
            "units": {
                "Troop": {
                    "points": 155,
                    "models": 10,
                    "speed": 5,
                    "melee": 3,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 20,
                    "waver": 11,
                    "rout": 14
                },
                "Regiment": {
                    "points": 220,
                    "models": 20,
                    "speed": 5,
                    "melee": 3,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 25,
                    "waver": 15,
                    "rout": 18
                }
            }
        },
        "Doppelgangers": {
            "id": 3,
            "special": [
                "Stealthy",
                "Doppelganger"
            ],
            "type": 0,
            "units": {
                "Regiment": {
                    "points": 150,
                    "models": 20,
                    "speed": 5,
                    "melee": 5,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 10,
                    "waver": 14,
                    "rout": 17
                }
            }
        },
        "Scarecrows": {
            "id": 4,
            "special": [
                "Shambling",
                "Stealthy"
            ],
            "type": 0,
            "units": {
                "Regiment": {
                    "points": 80,
                    "models": 20,
                    "speed": 5,
                    "melee": 5,
                    "ranged": false,
                    "defence": 3,
                    "attacks": 15,
                    "waver": false,
                    "rout": 14
                },
                "Horde": {
                    "points": 130,
                    "models": 40,
                    "speed": 5,
                    "melee": 4,
                    "ranged": false,
                    "defence": 3,
                    "attacks": 30,
                    "waver": false,
                    "rout": 21
                },
                "Legion": {
                    "points": 290,
                    "models": 60,
                    "speed": 5,
                    "melee": 5,
                    "ranged": false,
                    "defence": 3,
                    "attacks": 40,
                    "waver": false,
                    "rout": 27
                }
            }
        },
        "Phantoms": {
            "id": 5,
            "special": [
                {
                    "Crushing Strength": 1
                },
                "Fly",
                "Shambling"
            ],
            "type": 0,
            "units": {
                "Troop": {
                    "points": 130,
                    "models": 10,
                    "speed": 10,
                    "melee": 4,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 10,
                    "waver": false,
                    "rout": 12
                },
                "Regiment": {
                    "points": 185,
                    "models": 20,
                    "speed": 10,
                    "melee": 4,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 12,
                    "waver": false,
                    "rout": 16
                }
            }
        },
        "Needle-fangs": {
            "id": 6,
            "irregular": true,
            "special": [
                {
                    "Crushing Strength": 1,
                    "Height": 0
                },
                "Pathfinder",
                "Vanguard",
                "Stealthy"
            ],
            "type": 1,
            "units": {
                "Regiment": {
                    "points": 85,
                    "models": 3,
                    "speed": 5,
                    "melee": 5,
                    "ranged": false,
                    "defence": 3,
                    "attacks": 12,
                    "waver": 9,
                    "rout": 12
                },
                "Horde": {
                    "points": 120,
                    "models": 6,
                    "speed": 5,
                    "melee": 5,
                    "ranged": false,
                    "defence": 3,
                    "attacks": 24,
                    "waver": 13,
                    "rout": 16
                }
            }
        },
        "Butchers": {
            "id": 7,
            "special": [
                {
                    "Crushing Strength": 2
                },
                "Shambling",
                "Stealthy"
            ],
            "type": 1,
            "units": {
                "Regiment": {
                    "points": 145,
                    "models": 3,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 9,
                    "waver": false,
                    "rout": 15
                },
                "Horde": {
                    "points": 220,
                    "models": 6,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 18,
                    "waver": false,
                    "rout": 18
                }
            }
        },
        "Shadowhounds": {
            "id": 8,
            "special": [
                "Nimble",
                "Stealthy",
                {
                    "Thunderous Charge": 1,
                    "Regeneration": 5,
                    "Height": 1
                }
            ],
            "type": 2,
            "units": {
                "Troop": {
                    "points": 130,
                    "models": 5,
                    "speed": 9,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 10,
                    "waver": 10,
                    "rout": 13
                },
                "Regiment": {
                    "points": 200,
                    "models": 10,
                    "speed": 9,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 20,
                    "waver": 14,
                    "rout": 17
                }
            }
        },
        "Nightmares": {
            "id": 9,
            "irregular": true,
            "special": [
                "Fly",
                {
                    "Thunderous Charge": 1,
                    "Crushing Strength": 1,
                    "Windblast": 5
                }
            ],
            "type": 3,
            "units": {
                "Regiment": {
                    "points": 180,
                    "models": 3,
                    "speed": 10,
                    "melee": 3,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 9,
                    "waver": 13,
                    "rout": 16
                }
            }
        },
        "Fiends": {
            "id": 10,
            "special": [
                "Vicious",
                "Stealthy",
                {
                    "Crushing Strength": 1
                }
            ],
            "type": 3,
            "units": {
                "Regiment": {
                    "points": 130,
                    "models": 3,
                    "speed": 8,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 12,
                    "waver": 12,
                    "rout": 15
                },
                "Horde": {
                    "points": 200,
                    "models": 6,
                    "speed": 8,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 24,
                    "waver": 15,
                    "rout": 18
                }
            }
        },
        "Mind-screech": {
            "id": 11,
            "special": [
                {
                    "Height": 2,
                    "Piercing": 3
                },
                "Pathfinder",
                "Firebolt",
                "Stealthy"
            ],
            "type": 5,
            "units": {
                "Mind-screech": {
                    "points": 230,
                    "models": 1,
                    "speed": 5,
                    "melee": 6,
                    "ranged": 4,
                    "defence": 4,
                    "attacks": 12,
                    "waver": 16,
                    "rout": 19
                }
            }
        },
        "Shadow Hulk": {
            "id": 12,
            "special": [
                {
                    "Crushing Strength": 3
                },
                "Strider"
            ],
            "type": 5,
            "units": {
                "Shadow Hulk": {
                    "points": 170,
                    "models": 1,
                    "speed": 5,
                    "melee": 3,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 9,
                    "waver": false,
                    "rout": 20
                }
            }
        },
        "Planar Apparition": {
            "id": 13,
            "special": [
                {
                    "Regeneration": 4
                },
                "Nimble",
                "Pathfinder",
                "Ensnare",
                "Stealthy"
            ],
            "type": 5,
            "spells": {
                "Heal": 7
            },
            "units": {
                "Planar Apparition": {
                    "points": 165,
                    "models": 1,
                    "speed": 7,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 4,
                    "waver": 13,
                    "rout": 15
                }
            }
        },
        "Terror": {
            "id": 14,
            "special": [
                {
                    "Regeneration": 4,
                    "Crushing Strength": 1
                },
                "Ensnare",
                "Shambling"
            ],
            "type": 5,
            "units": {
                "Terror": {
                    "points": 255,
                    "models": 1,
                    "speed": 6,
                    "melee": 3,
                    "ranged": false,
                    "defence": 3,
                    "attacks": 15,
                    "waver": false,
                    "rout": 20
                }
            }
        },
        "Screamer": {
            "id": 15,
            "special": [
                "Stealthy",
                {
                    "Height": 2
                }
            ],
            "type": 5,
            "spells": {
                "Lightning Bolt": 5
            },
            "units": {
                "Screamer": {
                    "points": 115,
                    "models": 1,
                    "speed": 4,
                    "melee": 6,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 3,
                    "waver": 11,
                    "rout": 14
                }
            }
        },
        "Portal of Despair": {
            "id": 16,
            "special": [
                "Advanced Deployment",
                "Stealthy",
                {
                    "Height": 4
                },
                "Portal of Despair"
            ],
            "type": 4,
            "units": {
                "Portal of Despair": {
                    "points": 80,
                    "models": 1,
                    "speed": false,
                    "melee": false,
                    "ranged": false,
                    "defence": 5,
                    "attacks": false,
                    "waver": false,
                    "rout": 18
                }
            }
        },
        "Horror": {
            "id": 17,
            "special": [
                "Individual",
                "Stealthy"
            ],
            "type": 10,
            "spells": {
                "Surge": 6
            },
            "units": {
                "Horror": {
                    "points": 90,
                    "models": 1,
                    "speed": 7,
                    "melee": 6,
                    "ranged": false,
                    "defence": 3,
                    "attacks": 1,
                    "waver": 10,
                    "rout": 13
                }
            },
            "options": {
                "spells": {
                    "Bane Chant": {
                        "points": 15,
                        "value": 2
                    }
                }
            }
        },
        "Shade": {
            "id": 18,
            "special": [
                "Fly",
                "Individual",
                {
                    "Crushing Strength": 1
                },
                "Stealthy"
            ],
            "type": 10,
            "units": {
                "Shade": {
                    "points": 145,
                    "models": 1,
                    "speed": 10,
                    "melee": 3,
                    "ranged": false,
                    "defence": 5,
                    "attacks": 5,
                    "waver": 11,
                    "rout": 13
                }
            }
        },
        "Banshee": {
            "id": 19,
            "special": [
                "Fly",
                "Stealthy",
                "Individual"
            ],
            "type": 10,
            "spells": {
                "Windblast": 7
            },
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
                "spells": {
                    "Lightning Bolt": {
                        "points": 30,
                        "value": 5
                    }
                }
            }
        },
        "Void Lurker": {
            "id": 20,
            "special": [
                {
                    "Crushing Strength": 2,
                    "Thunderous Charge": 1,
                    "Regeneration": 5
                },
                "Fly"
            ],
            "type": 15,
            "units": {
                "Void Lurker": {
                    "points": 260,
                    "models": 1,
                    "speed": 10,
                    "melee": 3,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 10,
                    "waver": 17,
                    "rout": 19
                }
            }
        },
        "Dread Fiend": {
            "id": 21,
            "special": [
                {
                    "Crushing Strength": 2
                },
                "Nimble",
                "Vicious",
                "Stealthy"
            ],
            "type": 13,
            "units": {
                "Dread Fiend": {
                    "points": 120,
                    "models": 1,
                    "speed": 8,
                    "melee": 3,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 5,
                    "waver": 14,
                    "rout": 17
                }
            }
        },
        "The Dream Hunter": {
            "id": 22,
            "special": [
                "Stealthy",
                "Dream Hunter",
                "Individual",
                {
                    "Lifeleech": 2,
                    "Crushing Strength": 1
                }
            ],
            "legend": true,
            "type": 10,
            "units": {
                "The Dream Hunter": {
                    "points": 200,
                    "models": 1,
                    "speed": 6,
                    "melee": 4,
                    "ranged": false,
                    "defence": 4,
                    "attacks": 8,
                    "waver": 14,
                    "rout": 17
                }
            }
        }
    }
}))