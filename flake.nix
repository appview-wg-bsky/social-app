{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    { nixpkgs, systems, ... }:
    let
      forAllSystems =
        function: nixpkgs.lib.genAttrs (import systems) (system: function nixpkgs.legacyPackages.${system});
    in
    {
      packages = forAllSystems (pkgs: {
        default = pkgs.callPackage ./default.nix { };
      });
      devShells = forAllSystems (pkgs: {
        default =
          with pkgs;
          mkShell {
            packages = [
              just
              fastmod
              nodejs
              yarn
              crowdin-cli

              typescript
              typescript-language-server
            ];
          };
      });
    };
}
