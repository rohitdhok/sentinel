const securityKnowledge = [
    {
        id: "repeated_authentication_failure",
        title: "Too Many Failed Login Attempts",
        category: "Login & Accounts",
        riskLevel: "High",

        summary:
            "Someone tried to sign in several times but couldn't get in.",

        whatHappened:
            "Sentinel noticed several failed attempts to access an account within a short time.",

        whatItMeans:
            "This could be someone who forgot their password. It could also be someone trying to guess another person's password.",

        whySuspicious: [
            "Many failed attempts happen within a few minutes.",
            "Someone repeatedly tries to access the same account.",
            "The attempts happen at an unusual time.",
            "The attempts are followed by a successful login that the account owner doesn't recognize."
        ],

        attackerTechniques: [
            {
                name: "Guessing passwords",
                description:
                    "Someone repeatedly tries different passwords until one works."
            },
            {
                name: "Trying common passwords",
                description:
                    "Someone tries a few popular passwords against several accounts."
            },
            {
                name: "Using stolen passwords",
                description:
                    "Someone tries passwords exposed in a previous data breach."
            }
        ],

        recommendedActions: [
            "Check whether the account owner recognizes the attempts.",
            "Look for a successful login around the same time.",
            "If the activity is unexpected, review the affected account.",
            "If you suspect someone gained access, change the password and review active sessions.",
            "Use a strong, unique password and enable two-step verification where available."
        ],

        relatedEvents: [
            "authentication_failure",
            "password_check_failed",
            "session_opened"
        ],

        importantNote:
            "Several failed attempts don't automatically mean someone is attacking you. " +
            "Check the surrounding activity before deciding what happened."
    },

    {
        id: "repeated_privilege_switch_failure",
        title: "Failed Attempts to Access Another Account",
        category: "Account Access",
        riskLevel: "Very High",

        summary:
            "Someone repeatedly tried to switch to another account but failed.",

        whatHappened:
            "Sentinel noticed several failed attempts to use the su command to switch accounts.",

        whatItMeans:
            "Some accounts have more permissions than others. Repeated failed attempts to access another account may be a mistake or an attempt to gain extra access.",

        whySuspicious: [
            "Several attempts fail within a few minutes.",
            "The target account has administrator permissions.",
            "The person trying to switch accounts doesn't normally need access to it.",
            "The attempts are followed by a successful account switch."
        ],

        attackerTechniques: [
            {
                name: "Guessing another account's password",
                description:
                    "Someone repeatedly tries to discover the password for another account."
            },
            {
                name: "Trying to gain more access",
                description:
                    "Someone who already has an account tries to access a more powerful account."
            }
        ],

        recommendedActions: [
            "Check which account was trying to switch and which account it targeted.",
            "Confirm whether the attempts were expected.",
            "Check whether any attempt eventually succeeded.",
            "Review what happened after a successful switch.",
            "Investigate further if someone tried to access an administrator account without permission."
        ],

        relatedEvents: [
            "failed_privilege_switch",
            "privilege_switch",
            "authentication_failure",
            "privileged_session_opened"
        ],

        importantNote:
            "These events show failed attempts to switch accounts. They do not prove that anyone gained access."
    },

    {
        id: "privilege_switch",
        title: "Switched to Another Account",
        category: "Account Access",
        riskLevel: "Informational",

        summary:
            "Someone successfully started a session as another user.",

        whatHappened:
            "Sentinel recorded that a user switched to another account using the su command.",

        whatItMeans:
            "People sometimes switch accounts to perform tasks that their usual account cannot do. This can be normal system administration.",

        whySuspicious: [
            "Someone switches to an administrator account without a clear reason.",
            "The switch follows several failed attempts.",
            "The account switch happens at an unexpected time.",
            "Unusual commands run after the switch."
        ],

        attackerTechniques: [
            {
                name: "Misusing another account",
                description:
                    "Someone uses another account to access files or perform actions they normally cannot."
            },
            {
                name: "Using a compromised account",
                description:
                    "Someone who has stolen a password may use it to switch accounts."
            }
        ],

        recommendedActions: [
            "Check which account started the switch and which account was entered.",
            "Confirm that the switch was expected.",
            "Review the activity that followed.",
            "Pay special attention to administrator accounts and unexpected system changes."
        ],

        relatedEvents: [
            "failed_privilege_switch",
            "privileged_session_opened",
            "sudo_command",
            "session_opened",
            "session_closed"
        ],

        importantNote:
            "Switching accounts is not automatically suspicious. What matters is who did it, which account they accessed, and what happened next."
    },

    {
        id: "privileged_session_opened",
        title: "Administrator Access Started",
        category: "Administrator Activity",
        riskLevel: "Medium",

        summary:
            "A user started a session using administrator permissions.",

        whatHappened:
            "Sentinel recorded the start of a session opened through sudo.",

        whatItMeans:
            "Administrator permissions allow certain users to change system settings, manage accounts, and perform other powerful tasks.",

        whySuspicious: [
            "Someone uses administrator access unexpectedly.",
            "The account doesn't normally perform administrative work.",
            "The session starts at an unusual time.",
            "Unexpected commands or system changes follow."
        ],

        attackerTechniques: [
            {
                name: "Misusing administrator access",
                description:
                    "Someone with access to an administrator account uses it for an unauthorized purpose."
            },
            {
                name: "Changing system settings",
                description:
                    "Someone with sufficient permissions changes settings to gain access or weaken protection."
            }
        ],

        recommendedActions: [
            "Check who started the administrator session.",
            "Review the commands run during the session, if available.",
            "Confirm whether the activity was authorized.",
            "Investigate unexpected changes to accounts, services, or security settings."
        ],

        relatedEvents: [
            "sudo_command",
            "session_opened",
            "session_closed",
            "privilege_switch"
        ],

        importantNote:
            "Administrator access is often needed for normal maintenance. This event alone does not mean anything harmful happened."
    },

    {
        id: "sudo_command",
        title: "Administrator Command Run",
        category: "Administrator Activity",
        riskLevel: "Context Dependent",

        summary:
            "A user ran a command using sudo.",

        whatHappened:
            "Sentinel recorded a command that was run through sudo. The log may include the user and the command.",

        whatItMeans:
            "Some commands need extra permissions to work. Administrators commonly use sudo to run them.",

        whySuspicious: [
            "A command changes user accounts or passwords unexpectedly.",
            "A command changes security settings without authorization.",
            "A command stops a security or monitoring service unexpectedly.",
            "A command downloads or runs an unfamiliar program."
        ],

        attackerTechniques: [
            {
                name: "Changing important settings",
                description:
                    "Someone with administrator access changes the system in an unauthorized way."
            },
            {
                name: "Weakening security",
                description:
                    "Someone attempts to turn off or weaken protections."
            },
            {
                name: "Keeping unauthorized access",
                description:
                    "Someone changes accounts or services to make it easier to return later."
            }
        ],

        recommendedActions: [
            "Read the recorded command and identify who ran it.",
            "Check whether the command was part of an expected task.",
            "Investigate unexpected changes to system settings.",
            "Check nearby login and administrator activity for more context."
        ],

        relatedEvents: [
            "privileged_session_opened",
            "privilege_switch",
            "session_closed"
        ],

        importantNote:
            "Running a command with sudo is not automatically dangerous. Sentinel records this activity; additional rules are needed to identify specific dangerous commands."
    },

    {
        id: "session_opened",
        title: "A Session Started",
        category: "Login & Accounts",
        riskLevel: "Informational",

        summary:
            "The system recorded the start of a session.",

        whatHappened:
            "A system service recorded that a session began. Depending on the service, it may be related to a login or an administrative operation.",

        whatItMeans:
            "A session is a period of activity associated with a user or system operation. These records help show what happened and when.",

        whySuspicious: [
            "An unexpected account appears in the logs.",
            "The event follows repeated failed login attempts.",
            "The session is followed by unexpected administrator activity.",
            "The activity doesn't match what the user was expected to do."
        ],

        attackerTechniques: [
            {
                name: "Accessing an account without permission",
                description:
                    "Someone who has obtained valid login details may start a session."
            },
            {
                name: "Using someone else's account",
                description:
                    "Someone uses another person's account to access the system."
            }
        ],

        recommendedActions: [
            "Check which user or service started the session.",
            "Look at nearby login events for context.",
            "Confirm whether the activity was expected.",
            "Review administrator commands if the session seems suspicious."
        ],

        relatedEvents: [
            "authentication_failure",
            "privileged_session_opened",
            "sudo_command",
            "session_closed"
        ],

        importantNote:
            "Not every session represents a person logging in. Some system services create sessions for their own operations."
    },

    {
        id: "session_closed",
        title: "A Session Ended",
        category: "Login & Accounts",
        riskLevel: "Informational",

        summary:
            "The system recorded the end of a session.",

        whatHappened:
            "A system service recorded that a session ended. This can happen when a user logs out or an operation finishes.",

        whatItMeans:
            "Session-ending records help show when an activity stopped. They are most useful when compared with the events that happened before them.",

        whySuspicious: [
            "The session ends after unexpected administrator activity.",
            "The same account repeatedly starts and ends sessions in an unusual pattern.",
            "Important system changes happen just before the session ends."
        ],

        attackerTechniques: [
            {
                name: "Short periods of unauthorized activity",
                description:
                    "Someone may perform an unauthorized action and end the session soon afterward. A short session alone is not proof of wrongdoing."
            }
        ],

        recommendedActions: [
            "Look for the event that started the session.",
            "Review the activity that occurred before it ended.",
            "Check for unexpected administrator commands or system changes.",
            "Keep relevant logs if you suspect unauthorized access."
        ],

        relatedEvents: [
            "session_opened",
            "privileged_session_opened",
            "sudo_command",
            "privilege_switch"
        ],

        importantNote:
            "Sessions normally end all the time. Investigate only when the surrounding activity gives you a reason for concern."
    }
];

export default securityKnowledge;