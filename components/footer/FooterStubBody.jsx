import { memo } from "react";
import BrandFrame from "./BrandFrame";
import QRCodeStub from "./QRCodeStub";
import { ICON_LIBRARY } from "./icons";
import { tr } from "./utils";

function FooterStubBody({ active, t, year, socials, siteUrl }) {
    return (
        <div className="ftr-stub-body">
            <div className="ftr-field ftr-field-brand">
                <span className="ftr-field-label">TBS</span>
                <span className="ftr-field-value">
                    <BrandFrame active={active}>The Best Solution</BrandFrame>
                </span>
            </div>

            <div className="ftr-field ftr-field-social">
                <span className="ftr-field-label">{tr(t, "footer.connect", "تواصل")}</span>
                <div className="ftr-social-icons">
                    {(socials || []).map(({ _id, href, label, iconType, iconKey, image }) => {
                        const Icon = iconType === "preset" ? ICON_LIBRARY[iconKey]?.Icon : null;
                        return (
                            <a
                                key={_id}
                                href={href}
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel="noreferrer"
                                aria-label={label}
                            >
                                {iconType === "custom" && image?.url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={image.url} alt="" className="ftr-social-custom-icon" />
                                ) : Icon ? (
                                    <Icon />
                                ) : null}
                            </a>
                        );
                    })}
                </div>
            </div>

            <div className="ftr-field ftr-field-copy">
                <span className="ftr-field-label">© {year}</span>
                <span className="ftr-field-value">
                    <QRCodeStub url={siteUrl} label={tr(t, "footer.scanToVisit", "امسح الكود لزيارة الموقع")} />
                </span>
            </div>
        </div>
    );
}

export default memo(FooterStubBody);