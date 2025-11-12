import React from 'react';
import { colors } from '../utils/theme';
import './TariqaTijaniyyahScreen.css';

const TariqaTijaniyyahScreen: React.FC = () => {
  const renderInfoCard = (title: string, content: string, icon: string, color: string) => (
    <div className="tariqa-info-card">
      <div className="tariqa-card-gradient" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)` }}>
        <div className="tariqa-card-header">
          <span className="tariqa-card-icon">{icon}</span>
          <h3 className="tariqa-card-title">{title}</h3>
        </div>
        <p className="tariqa-card-content">{content}</p>
      </div>
    </div>
  );

  const renderSectionHeader = (title: string, icon: string) => (
    <div className="tariqa-section-header">
      <span className="tariqa-section-icon">{icon}</span>
      <h2 className="tariqa-section-title">{title}</h2>
    </div>
  );

  return (
    <div className="tariqa-container">
      <div className="tariqa-scroll-content">
        {/* Header */}
        <div className="tariqa-header">
          <div className="tariqa-header-content">
            <span className="tariqa-header-star">⭐</span>
            <h1 className="tariqa-header-title">TARIQA TIJANIYYAH</h1>
            <p className="tariqa-header-subtitle">The Tijānī Path</p>
            <p className="tariqa-header-arabic">الطريقة التجانية</p>
          </div>
        </div>

        {/* Introduction */}
        {renderSectionHeader("Introduction", "📖")}
        {renderInfoCard(
          "What is Tariqa Tijaniyyah?",
          "The Tijāniyyah (Arabic: الطريقة التجانية, transliterated: Al-Ṭarīqah al-Tijāniyyah, or 'The Tijānī Path') is a sufi tariqa (order, path) originating in North Africa but now more widespread in West Africa, particularly in Senegal, The Gambia, Mauritania, Mali, and Northern Nigeria and Sudan. Its adherents are called Tijānī (spelled Tijaan or Tiijaan in Wolof, Tidiane or Tidjane in French).",
          "ℹ️",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Core Principles",
          "Tijānī attach a large importance to culture and education, and emphasize the individual adhesion of the disciple (murīd). To become a member of the order, one must receive the Tijānī wird, or a sequence of holy phrases to be repeated twice daily, from a muqaddam, or representative of the order.",
          "🎓",
          colors.primary
        )}

        {/* Foundation */}
        {renderSectionHeader("Foundation of the Order", "🏴")}
        {renderInfoCard(
          "Founder: Sīdī 'Aḥmad al-Tijānī",
          "Sīdī 'Aḥmad al-Tijānī (1737–1815), who was born in Algeria and died in Fes, Morocco, founded the Tijānī order around 1781. Tijānī Islam, an 'Islam for the poor,' reacted against the conservative, hierarchical Qadiriyyah brotherhood then dominant, focusing on social reform and grass-roots Islamic revival.",
          "👤",
          colors.success
        )}

        {/* Expansion */}
        {renderSectionHeader("Expansion in West Africa", "🌍")}
        {renderInfoCard(
          "Early Expansion",
          "Although several other Sufi orders overshadow the Tijāniyyah in its birthplace of North Africa, the order has become the largest Sufi order in West Africa and continues to expand rapidly. It was brought to southern Mauritania around 1789 by Muḥammad al-Ḥāfiẓ of the 'Idaw `Ali tribe.",
          "📈",
          colors.warning
        )}

        {renderInfoCard(
          "Key Figures: Omar Tall",
          "Muḥammad al-Ḥāfiẓ's disciple Mawlūd Vāl initiated the 19th-century Fulbe leader Al-Ḥājj Omar Tall (Allaaji Omar Taal) and the Fulbe cleric `Abd al-Karīm an-Nāqil from Futa Jalon (modern Guinea) into the order. After receiving instruction from Muḥammad al-Ghālī from 1828 to 1830 in Makka, Omar Tall was appointed Khalīfa (successor or head representative) of Aḥmed at-Tijānī for all of the Western Sudan.",
          "👥",
          colors.accentTeal
        )}

        {renderInfoCard(
          "El-Hajj Malick Sy",
          "In Senegal's Wolof country, especially the northern regions of Kajoor and Jolof, the Tijānī Order was spread primarily by El-Hajj Malick Sy (spelled 'El-Hadji Malick Sy' in French, 'Allaaji Maalig Si' in Wolof), born in 1855 near Dagana. In 1902, he founded a zāwiya (religious center) in Tivaouane (Tiwaawan), which became a center for Islamic education and culture under his leadership.",
          "📚",
          colors.primary
        )}

        {renderInfoCard(
          "Ibrahima Niass - The Fayḍah",
          "The branch founded by Abdoulaye Niass's son, Al-Hadj Ibrahima Niass (Allaaji Ibrayima Ñas, often called 'Baye' or 'Baay', which is 'father' in Wolof), in the Kaolack suburb of Medina Baye in 1930, has become by far the largest and most visible Tijānī branch around the world today. Ibrahima Niass's teaching that all disciples, and not only specialists, can attain a direct mystical knowledge of God through tarbiyyah rūhiyyah (mystical education) has struck a chord with millions worldwide.",
          "⭐",
          colors.success
        )}

        {/* Jihad States */}
        {renderSectionHeader("Tijaniyah Jihad States", "🛡️")}
        {renderInfoCard(
          "Tijaniyya Jihad State",
          "The Tijaniyya Jihad state was founded on 10 March 1861 by `Umar ibn Sa`id in Segu (the traditional ruler style Fama was continued by the autochthonous dynasty in part of the state until the 1893 French takeover), using the ruler title Imam, also styled Amir al-Muslimin; in 1862 Masina (ruler title Ardo) is incorporated into Tijaniyya Jihad state.",
          "🏴",
          colors.warning
        )}

        {renderInfoCard(
          "Dina (Sise Jihad State)",
          "Dina (the Sise Jihad state), in 1818 founded by Shaykhu Ahmadu, ruler title Imam (also styled Amir al-Mu´minin); on 16 May 1862 conquered by the Tijaniyya Jihad state.",
          "🏠",
          colors.accentTeal
        )}

        {/* Practices */}
        {renderSectionHeader("Practices", "❤️")}
        {renderInfoCard(
          "The Tijānī Wird",
          "Upon entering the order, one receives the Tijānī wird from a muqaddam or representative of the order. The muqaddam explains to the initiate the duties of the order, which include keeping the basic tenets of Islam (including the five pillars of Islam), to honor and respect one's parents, and not to follow another Sufi order in addition to the Tijāniyya. Initiates are to pronounce the Tijānī wird (a process that usually takes ten to fifteen minutes) every morning and afternoon.",
          "⏰",
          colors.primary
        )}

        {renderInfoCard(
          "The Wird Formula",
          "The wird is a formula that includes repetitions of 'Lā 'ilāha 'ilā Llāh' ('There is no God but Allah'), 'Astaghfiru Llāh' ('I ask God for forgiveness'), and a prayer for Muḥammad called the Ṣalātu l-Fātiḥ (Prayer of the Opener).",
          "🔖",
          colors.success
        )}

        {renderInfoCard(
          "Waẓīfah and Ḥaḍarat al-Jumʿah",
          "They are also to participate in the Waẓīfah, a similar formula that is chanted as a group, often at a mosque, after the sundown prayer (maghrib), as well as in the Ḥaḍarat al-Jumʿah, another formula chanted among other disciples on Friday afternoon.",
          "👥",
          colors.warning
        )}

        {renderInfoCard(
          "Dhikr and Meetings",
          "Additionally, disciples in many areas organize regular meetings, often on Thursday evenings or before or after Waẓīfa and Ḥaḍarat al-Jumʿah, to engage in dhikr Allāh, or mentioning God. This consists in repeating the phrase 'Lā 'ilāha 'ilā Llāh' or simply 'Allāh' as a group.",
          "💬",
          colors.accentTeal
        )}

        {renderInfoCard(
          "Mawlid an-nabawī (Gàmmu)",
          "The most important communal event of the year for most Tijānī groups is the Mawlid an-nabawī (known in Wolof as the Gàmmu, spelled Gamou in French), or the celebration of the birth of Muḥammad, which falls on the night of the 12th of the Islamic month of Rabīʿ al-'Awwal. Most major Tijānī religious centers organize a large Mawlid event once a year, and hundreds of thousands of disciples attend the largest ones.",
          "📅",
          colors.primary
        )}

        {/* Footer */}
        <div className="tariqa-footer">
          <p className="tariqa-footer-text">
            "The best of people are those who benefit others"
          </p>
          <p className="tariqa-footer-subtext">
            - Prophet Muhammad (SAW)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TariqaTijaniyyahScreen;

