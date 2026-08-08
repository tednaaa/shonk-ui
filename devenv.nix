{ pkgs, ... }:
{
  languages = {
    javascript = {
      enable = true;
      package = pkgs.nodejs_24;
    };
  };

  scripts = {
    knip.exec = "pnpm dlx knip";
    update_npm_packages.exec = "pnpm dlx npm-check-updates -i --format group";
  };
}
