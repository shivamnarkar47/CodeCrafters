import { FeaturesSectionWithHoverEffects } from "../feature-section-with-hover-effects";

function InsuranceCard() {
  return (
    <div className="max-h-screen w-full">
      <div className="absolute top-0 left-0 w-full">
        <FeaturesSectionWithHoverEffects />
      </div>
    </div>
  );
}

export { InsuranceCard };