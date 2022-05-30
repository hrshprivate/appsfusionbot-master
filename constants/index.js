const PLAN_CREW = {
    "reply_markup": {
        "one_time_keyboard": false,
        "resize_keyboard": true,
        "inline_keyboard": [
            [{
                text: "Select",
                callback_data: JSON.stringify({
                    plan: "CREW",
                    state: "select"
                })
            }]
        ]
    }
};

const PLAN_MINI = {
    "reply_markup": {
        "one_time_keyboard": false,
        "resize_keyboard": true,
        "inline_keyboard": [
            [{
                text: "Select",
                callback_data: JSON.stringify({
                    plan: "MINI",
                    state: "select"
                })
            }]
        ]
    }
};

const PLAN_BASIC = {
    "reply_markup": {
        "one_time_keyboard": false,
        "resize_keyboard": true,
        "inline_keyboard": [
            [{
                text: "Select",
                callback_data: JSON.stringify({
                    plan: "BASIC",
                    state: "select"
                })
            }]
        ]
    }
};


const MAIN_MENU = {
    "reply_markup": {
        "one_time_keyboard": false,
        "resize_keyboard": true,
        "keyboard": [
            [{
                text: "Search",
                callback_data: "callback-btn-search"
            }, {
                text: "My apps",
                callback_data: "apps"
            }],
            [{
                text: "Leave feedback",
                callback_data: "feedback"
            }],
            [{
                text: "Subscription",
                callback_data: "subscription"
            }]
        ]
    }
};

const SEARCH_MENU = {
    "parse_mode": "markdown",
    "reply_markup": {
        "one_time_keyboard": false,
        "resize_keyboard": true,
        "keyboard": [
            [{
                text: "/setcountry",
                callback_data: "callback-btn-setcountry"
            }, {
                text: "/setstore",
                callback_data: "callback-btn-setstore"
            }],
            [{
                text: "/mainmenu",
                callback_data: "callback-btn-mainmenu"
            }]
        ]
    }
};


const RAITING_MENU = {
    "reply_markup": {
        "one_time_keyboard": true,
        "resize_keyboard": true,
        "keyboard": [
            [{
                text: "1"
            }], 
            [{
                text: "2"
            }],
            [{
                text: "3"
            }],
            [{
                text: "4"
            }],
            [{
                text: "5"
            }],
        ]
    }
};


const COUNTRIES = {
        'Algeria': ['DZ','dz'],
        'Angola': ['AO','ao'],
        'Anguilla': ['AI','ai'],
        'Argentina': ['AR','ar'],
        'Armenia': ['AM','am'],
        'Australia': ['AU','au'],
        'Austria': ['AT','at'],
        'Azerbaijan': ['AZ','az'],
        'Bahrain': ['BH','bh'],
        'Barbados': ['BB','bb'],
        'Belarus': ['BY','by'],
        'Belgium': ['BE','be'],
        'Belize': ['BZ','bz'],
        'Bermuda': ['BM','bm'],
        'Bolivia': ['BO','bo'],
        'Botswana': ['BW','bw'],
        'Brazil': ['BR','br'],
        'British Virgin Islands': ['VG','vg'],
        'Brunei Darussalam': ['BN','bn'],
        Bulgaria: ['BG','bg'],
        Canada: ['CA','ca'],
        'Cayman Islands': ['KY','ky'],
        Chile: ['CL','cl'],
        China: ['CN','cn'],
        'Hong Kong, SAR China': ['HK','hk'],
        'Macao, SAR China': ['MO','mo'],
        Colombia: ['CO','co'],
        'Costa Rica': ['CR','cr'],
        Croatia: ['HR','hr'],
        Cyprus: ['CY','cy'],
        'Czech Republic': ['CZ','cz'],
        Denmark: ['DK','dk'],
        Dominica: ['DM','dm'],
        Ecuador: ['EC','ec'],
        Egypt: ['EG','eg'],
        'El Salvador': ['SV','sv'],
        Estonia: ['EE','ee'],
        Finland: ['FI','fi'],
        France: ['FR','fr'],
        Germany: ['DE','de'],
        Ghana: ['GH','gh'],
        Greece: ['GR','gr'],
        Grenada: ['GD','gd'],
        Guatemala: ['GT','gt'],
        Guyana: ['GY','gy'],
        Honduras: ['HN','hn'],
        Hungary: ['HU','hu'],
        Iceland: ['IS','is'],
        India: ['IN','in'],
        Indonesia: ['ID','id'],
        Ireland: ['IE','ie'],
        Israel: ['IL','il'],
        Italy: ['IT','it'],
        Jamaica: ['JM','jm'],
        Japan: ['JP','jp'],
        Jordan: ['JO','jo'],
        Kenya: ['KE','ke'],
        'Korea (South)': ['KR','kr'],
        Kuwait: ['KW','kw'],
        Latvia: ['LV','lv'],
        Lebanon: ['LB','lb'],
        Lithuania: ['LT','lt'],
        Luxembourg: ['LU','lu'],
        'Macedonia, Republic of': ['MK','mk'],
        Madagascar: ['MG','mg'],
        Malaysia: ['MY','my'],
        Mali: ['ML','ml'],
        Malta: ['MT','mt'],
        Mauritius: ['MU','mu'],
        Mexico: ['MX','mx'],
        Montserrat: ['MS','ms'],
        Nepal: ['NP','np'],
        Netherlands: ['NL','nl'],
        'New Zealand': ['NZ','nz'],
        Nicaragua: ['NI','ni'],
        Niger: ['NE','ne'],
        Nigeria: ['NG','ng'],
        Norway: ['NO','no'],
        Oman: ['OM','om'],
        Pakistan: ['PK','pk'],
        Panama: ['PA','pa'],
        Paraguay: ['PY','py'],
        Peru: ['PE','pe'],
        Philippines: ['PH','ph'],
        Poland: ['PL','pl'],
        Portugal: ['PT','pt'],
        Qatar: ['QA','qa'],
        Romania: ['RO','ro'],
        'Russian Federation': ['RU','ru'],
        'Saudi Arabia': ['SA','sa'],
        Senegal: ['SN','sn'],
        Singapore: ['SG','sg'],
        Slovakia: ['SK','sk'],
        Slovenia: ['SI','si'],
        'South Africa': ['ZA','za'],
        Spain: ['ES','es'],
        'Sri Lanka': ['LK','lk'],
        Suriname: ['SR','sr'],
        Sweden: ['SE','se'],
        Switzerland: ['CH','ch'],
        'Taiwan, Republic of China': ['TW','tw'],
        'Tanzania, United Republic of': ['TZ','tz'],
        Thailand: ['TH','th'],
        Tunisia: ['TN','tn'],
        Turkey: ['TR','tr'],
        Uganda: ['UG','ug'],
        Ukraine: ['UA','ua'],
        'United Arab Emirates': ['AE','ae'],
        'United Kingdom': ['GB','gb'],
        'United States of America': ['US','us'],
        Uruguay: ['UY','uy'],
        Uzbekistan: ['UZ','uz'],
        'Venezuela (Bolivarian Republic)': ['VE','ve'],
        'Viet Nam': ['VN','vn'],
        Yemen:[ 'YE','ye']
      }

const COUNTRIES_HEARS = [
    'Algeria',
        'Angola',
        'Anguilla',
        'Argentina',
        'Armenia',
        'Australia',
        'Austria',
        'Azerbaijan',
        'Bahrain',
        'Barbados',
        'Belarus',
        'Belgium',
        'Belize',
        'Bermuda',
        'Bolivia',
        'Botswana',
        'Brazil',
        'British Virgin Islands',
        'Brunei Darussalam',
        'Bulgaria',
        'Canada',
        'Cayman Islands',
        'Chile',
        'China',
        'Hong Kong, SAR China',
        'Macao, SAR China',
        'Colombia',
        'Costa Rica',
        'Croatia',
        'Cyprus',
        'Czech Republic',
        'Denmark',
        'Dominica',
        'Ecuador',
        'Egypt',
        'El Salvador',
        'Estonia',
        'Finland',
        'France',
        'Germany',
        'Ghana',
        'Greece',
        'Grenada',
        'Guatemala',
        'Guyana',
        'Honduras',
        'Hungary',
        'Iceland',
        'India',
        'Indonesia',
        'Ireland',
        'Israel',
        'Italy',
        'Jamaica',
        'Japan',
        'Jordan',
        'Kenya',
        'Korea (South)',
        'Kuwait',
        'Latvia',
        'Lebanon',
        'Lithuania',
        'Luxembourg',
        'Macedonia, Republic of',
        'Madagascar',
        'Malaysia',
        'Mali',
        'Malta',
        'Mauritius',
        'Mexico',
        'Montserrat',
        'Nepal',
        'Netherlands',
        'New Zealand',
        'Nicaragua',
        'Niger',
        'Nigeria',
        'Norway',
        'Oman',
        'Pakistan',
        'Panama',
        'Paraguay',
        'Peru',
        'Philippines',
        'Poland',
        'Portugal',
        'Qatar',
        'Romania',
        'Russian Federation',
        'Saudi Arabia',
        'Senegal',
        'Singapore',
        'Slovakia',
        'Slovenia',
        'South Africa',
        'Spain',
        'Sri Lanka',
        'Suriname',
        'Sweden',
        'Switzerland',
        'Taiwan, Republic of China',
        'Tanzania, United Republic of',
        'Thailand',
        'Tunisia',
        'Turkey',
        'Uganda',
        'Ukraine',
        'United Arab Emirates',
        'United Kingdom',
        'United States of America',
        'Uruguay',
        'Uzbekistan',
        'Venezuela (Bolivarian Republic)',
        'Viet Nam',
        'Yemen'
]

const COUNTRIES_ARRAY = [
  [ 'DZ', 'dz' ], [ 'AO', 'ao' ], [ 'AI', 'ai' ], [ 'AR', 'ar' ],
  [ 'AM', 'am' ], [ 'AU', 'au' ], [ 'AT', 'at' ], [ 'AZ', 'az' ],
  [ 'BH', 'bh' ], [ 'BB', 'bb' ], [ 'BY', 'by' ], [ 'BE', 'be' ],
  [ 'BZ', 'bz' ], [ 'BM', 'bm' ], [ 'BO', 'bo' ], [ 'BW', 'bw' ],
  [ 'BR', 'br' ], [ 'VG', 'vg' ], [ 'BN', 'bn' ], [ 'BG', 'bg' ],
  [ 'CA', 'ca' ], [ 'KY', 'ky' ], [ 'CL', 'cl' ], [ 'CN', 'cn' ],
  [ 'HK', 'hk' ], [ 'MO', 'mo' ], [ 'CO', 'co' ], [ 'CR', 'cr' ],
  [ 'HR', 'hr' ], [ 'CY', 'cy' ], [ 'CZ', 'cz' ], [ 'DK', 'dk' ],
  [ 'DM', 'dm' ], [ 'EC', 'ec' ], [ 'EG', 'eg' ], [ 'SV', 'sv' ],
  [ 'EE', 'ee' ], [ 'FI', 'fi' ], [ 'FR', 'fr' ], [ 'DE', 'de' ],
  [ 'GH', 'gh' ], [ 'GR', 'gr' ], [ 'GD', 'gd' ], [ 'GT', 'gt' ],
  [ 'GY', 'gy' ], [ 'HN', 'hn' ], [ 'HU', 'hu' ], [ 'IS', 'is' ],
  [ 'IN', 'in' ], [ 'ID', 'id' ], [ 'IE', 'ie' ], [ 'IL', 'il' ],
  [ 'IT', 'it' ], [ 'JM', 'jm' ], [ 'JP', 'jp' ], [ 'JO', 'jo' ],
  [ 'KE', 'ke' ], [ 'KR', 'kr' ], [ 'KW', 'kw' ], [ 'LV', 'lv' ],
  [ 'LB', 'lb' ], [ 'LT', 'lt' ], [ 'LU', 'lu' ], [ 'MK', 'mk' ],
  [ 'MG', 'mg' ], [ 'MY', 'my' ], [ 'ML', 'ml' ], [ 'MT', 'mt' ],
  [ 'MU', 'mu' ], [ 'MX', 'mx' ], [ 'MS', 'ms' ], [ 'NP', 'np' ],
  [ 'NL', 'nl' ], [ 'NZ', 'nz' ], [ 'NI', 'ni' ], [ 'NE', 'ne' ],
  [ 'NG', 'ng' ], [ 'NO', 'no' ], [ 'OM', 'om' ], [ 'PK', 'pk' ],
  [ 'PA', 'pa' ], [ 'PY', 'py' ], [ 'PE', 'pe' ], [ 'PH', 'ph' ],
  [ 'PL', 'pl' ], [ 'PT', 'pt' ], [ 'QA', 'qa' ], [ 'RO', 'ro' ],
  [ 'RU', 'ru' ], [ 'SA', 'sa' ], [ 'SN', 'sn' ], [ 'SG', 'sg' ],
  [ 'SK', 'sk' ], [ 'SI', 'si' ], [ 'ZA', 'za' ], [ 'ES', 'es' ],
  [ 'LK', 'lk' ], [ 'SR', 'sr' ], [ 'SE', 'se' ], [ 'CH', 'ch' ],
  [ 'TW', 'tw' ], [ 'TZ', 'tz' ],
  [ 'TH', 'th' ], [ 'TN', 'tn' ],
  [ 'TR', 'tr' ], [ 'UG', 'ug' ],
  [ 'UA', 'ua' ], [ 'AE', 'ae' ],
  [ 'GB', 'gb' ], [ 'US', 'us' ],
  [ 'UY', 'uy' ], [ 'UZ', 'uz' ],
  [ 'VE', 've' ], [ 'VN', 'vn' ],
  [ 'YE', 'ye' ]
]

module.exports = {
    MAIN_MENU, 
    SEARCH_MENU,
    COUNTRIES,
    SEARCH_MENU,
    RAITING_MENU,
    COUNTRIES_HEARS,
    COUNTRIES_ARRAY,
    PLAN_CREW,
    PLAN_BASIC,
    PLAN_MINI
}