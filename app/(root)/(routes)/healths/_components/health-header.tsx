"use client";
import { HealthHeaderOrderCombobox } from "./health-header-order-combobox";
import { HealthHeaderVersionCombobox } from "./health-header-version-combobox";
import { HealthHeaderCreateBtn } from "./health-header-create-btn";

type Props = {};

export const HealthHeader: React.FC<Props> = () => {
  return (
    <div className="ml-auto flex items-center gap-2">
      <HealthHeaderOrderCombobox />
      <HealthHeaderVersionCombobox />
      <HealthHeaderCreateBtn />
    </div>
  );
};
