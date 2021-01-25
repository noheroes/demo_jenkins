FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80;https://+:443
ENV Kestrel__Certificates__Default__Path=/https/web.sunedu.gob.pe.pfx
ENV Kestrel__Certificates__Default__Password=changeit20
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["./src/NuGet.config", "./"]
COPY ["./src/gnosis.web.csproj", "./"]

RUN dotnet restore "./gnosis.web.csproj" --configfile ./NuGet.config -nowarn:msb3202,nu1503 

COPY ./src .
WORKDIR "/src/."
RUN dotnet build "gnosis.web.csproj" -c Release -o /app/build
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get install -y gnupg2 && \
    wget -qO- https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y build-essential nodejs

FROM build AS publish
RUN dotnet publish "gnosis.web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "gnosis.web.dll"]
