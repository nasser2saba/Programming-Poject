# Medicatie Herinneringsapp
~Saba Le Nassr (individueel)~

## 1. Doelstellingen 
De Medicatie Herinneringsapp heeft als doel om ouderen en chronische patiënten te helpen bij het correct en tijdig innemen van hun medicatie. De belangrijkste doelstellingen zijn:

**1.	Medicatiebeheer (MVP)**
o	CRUD: toevoegen, bewerken, verwijderen van medicijnen met naam, dosis, frequentie.
o	Zoeken en filteren op naam.

**2.	Herinneringen & Notificaties (MVP)**
o	Push-notificaties via Firebase Cloud Messaging (FCM).
o	E-mailherinneringen als back-up via NodeMailer.

**3.	Historiek & Overzicht (MVP)**
o	Vastleggen van dagelijkse inname-logs.
o	Kalenderweergave met status (voltooid of gemist).

**4.	Gebruikersbeheer & Security (MVP)**
o	Registratie en login met bcrypt-hashing.

**5.	User Interface & Gebruiksvriendelijkheid (MVP)**
o	Responsive mobiele UI (React Native of Flutter).
o	Tabbar: Meds, Herinneringen, Historiek, Profiel.



## 2. Doelgroep & Persona’s
De primaire doelgroep bestaat uit:
•	Ouderen die moeite hebben om hun medicatieschema te onthouden.
•	Chronische patiënten die dagelijks meerdere medicijnen moeten innemen.


## 3. Functionele Analyse

### 3.1 Use Cases & User Stories
|ID	|Use Case	|User Story	|Acceptatiecriteria|
|------|----------|--------------|------------------|
|UC1|	Medicatie toevoegen|Als gebruiker wil ik een nieuw medicijn toevoegen zodat ik herinneringen krijg.|Formulier met naam, dosis, frequentie, datum; bevestiging bij opslaan.|
|UC2|	Medicatie bewerken/verwijderen|	Als gebruiker wil ik medicatie aanpassen of verwijderen.|	Edit- en delete-knoppen; confirmatie bij verwijderen.|
|UC3|	Overzicht medicatieschema|	Als gebruiker wil ik een weekoverzicht zien.|	Kalenderweergave met icoontjes en legenda voltooide/gemiste doses.|
|UC4|	Notificaties ontvangen|	Als gebruiker wil ik herinneringen op ingestelde tijden.|	Keuze push of e-mail in profiel; testknop voor voorbeeldmelding.|
|UC5|	Historiek bekijken	|Als gebruiker wil ik mijn inname-historiek zien.	|Lijst met datum, tijd, status; filter op voltooid/gemist.|


### 3.2 Sprintplanning (MVP)
Sprint	Functionaliteiten	Prioriteit	Op te leveren
1. Autorisatie, Medicatie CRUD	Hoog	API (Node.js/Express), user auth, medicatie endpoints, basis UI-form
2. Notificaties (push & e-mail)	Hoog	FCM-integratie, NodeMailer setup, testpagina
3. Historiek & Overzicht	Midden	Logs in DB, kalendercomponent, filteropties
5. UI-finish & Toegankelijkheid	Laag	Responsiveness, icon-set, kleurcontrasten



## 4. Technische Architectuur
[React Native Frontend] <-- HTTPS --> [Node.js/Express API] <---> [PostgreSQL]
                                   |                             |
                                   --> [Firebase Cloud Messaging]
                                   --> [SMTP (NodeMailer)]

**ER-Model**
•	User(id, naam, email, hashed_password, rol)
•	Medication(id, user_id, naam, dosis, frequentie, start_date, end_date)
•	ReminderLog(id, medication_id, timestamp, status)

## 5. Wireframes & UI Schema
•	Home (Medicatie-overzicht): lijst + "+" knop
•	Medicatie Detail: invulvelden + Save/Delete
•	Kalender: weekweergave met icoontjes
•	Profiel/Instellingen: notificatievoorkeur, accountinfo

## 6. Conclusie
De Medicatie Herinneringsapp zal ouderen en chronische patiënten helpen om hun medicatie op tijd in te nemen. Door een gebruiksvriendelijke interface, herinneringsnotificaties en een veilige database-opslag wordt het eenvoudiger om medicatiebeheer efficiënt en betrouwbaar te maken.

